import { json, type RequestHandler } from '@sveltejs/kit';
import { readdir, readFile, stat, mkdir, access, constants } from 'fs/promises';
import { fileTypeFromBuffer } from 'file-type';
import { join, resolve } from 'path';
import { createHash } from 'crypto';
import { db } from '$lib/server/db';
import sharp from 'sharp';
import {
	blobExistsMaster,
	blobExistsWeb,
	uploadFileMaster,
	uploadFileWeb
} from '$lib/server/azure';

const BATCH_SIZE = 10; // Process files in batches to avoid memory issues

async function getFileMimeType(buffer: Buffer) {
	const type = await fileTypeFromBuffer(buffer);
	return type ? type.mime : 'application/octet-stream';
}

interface ProcessingStats {
	localMastersExists: number;
	localMastersCreated: number;
	localWebsExists: number;
	localWebCreated: number;
	blobMasterExists: number;
	blobWebExists: number;
	blobMasterCreated: number;
	blobWebCreated: number;
	errors: Array<{ file: string; error: string }>;
}

async function processFile(
	fullPath: string,
	stats: ProcessingStats,
	forceWeb: boolean = false
): Promise<void> {
	let masterBuffer: Buffer | null = null;
	let webBuffer: Buffer | null = null;

	try {
		// Read file once and reuse buffer
		masterBuffer = await readFile(fullPath);
		const hash = createHash('sha1').update(masterBuffer).digest('hex');
		const existingData = await db.query('SELECT * FROM files WHERE sha1_hash = $1', [hash]);
		let hasMaster = false;
		let hasWeb = false;

		if (existingData?.rows.length > 0) {
			console.log(`✅ DATABASE HIT - ${fullPath}: ${hash}`);
			hasMaster = existingData.rows[0].has_master;
			hasWeb = existingData.rows[0].has_web;
		}

		// Parallel metadata operations
		const [metadata, mimeType, fileStats] = await Promise.all([
			sharp(masterBuffer).metadata(),
			getFileMimeType(masterBuffer),
			stat(fullPath)
		]);

		if (hasMaster) {
			console.log(`✅ MASTER BLOB EXISTS - ${fullPath}: ${hash}`);
			stats.blobMasterExists++;
			hasMaster = true;
		} else {
			console.log(`⏳ CREATE MASTER BLOB - ${fullPath}: ${hash}`);
			hasMaster = await blobExistsMaster(hash);
			if (!hasMaster) {
				await uploadFileMaster(hash, masterBuffer);
			}
			stats.blobMasterCreated++;
			hasMaster = true;
		}

		if (hasWeb || forceWeb) {
			console.log(`✅ WEB BLOB EXISTS - ${fullPath}: ${hash}`);
			stats.blobWebExists++;
			hasWeb = true;
		} else {
			console.log(`⏳ CREATE MASTER BLOB - ${fullPath}: ${hash}`);
			hasWeb = await blobExistsWeb(hash);
			if (!hasWeb) {
				webBuffer = await sharp(masterBuffer)
					.resize({ width: 1000, height: 1000, fit: 'inside' })
					.webp()
					.toBuffer();
				await uploadFileWeb(hash, webBuffer);
			}
			stats.blobWebCreated++;
			hasWeb = true;
		}

		// === DATABASE UPDATE ===
		await db.query(
			`
			INSERT INTO files (sha1_hash, file_metadata, file_path, mime_type, file_stats, has_master, has_web)
			VALUES ($1, $2, $3, $4, $5, $6, $7)
			ON CONFLICT (sha1_hash)
			DO UPDATE
			SET
				file_metadata = EXCLUDED.file_metadata,
				mime_type = EXCLUDED.mime_type,
				file_stats = EXCLUDED.file_stats,
				file_path = EXCLUDED.file_path,
				has_master = EXCLUDED.has_master,
				has_web = EXCLUDED.has_web;
			`,
			[
				hash,
				JSON.stringify(metadata),
				fullPath,
				mimeType,
				JSON.stringify(fileStats),
				hasMaster,
				hasWeb
			]
		);
		console.log(`✅ DATABASE UPDATED - ${fullPath}: ${hash}`);
	} catch (error: any) {
		console.error(`❌ ERROR PROCESSING ${fullPath}:`, error);
		stats.errors.push({
			file: fullPath,
			error: error.message || String(error)
		});
	} finally {
		// Clear buffers to free memory
		masterBuffer = null;
		webBuffer = null;
	}
}

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { sourceDir, forceWeb = false } = await request.json();

		if (!sourceDir) {
			return json({ error: 'sourceDir is required' }, { status: 400 });
		}

		const absoluteDir = resolve(sourceDir);

		// Verify directory exists
		try {
			await access(absoluteDir, constants.R_OK);
		} catch {
			return json({ error: `Directory not accessible: ${absoluteDir}` }, { status: 400 });
		}

		const allFiles = await readdir(absoluteDir, { recursive: true, withFileTypes: true });
		const imageFiles = allFiles.filter((file) => file.isFile());

		const stats: ProcessingStats = {
			localMastersExists: 0,
			localMastersCreated: 0,
			localWebsExists: 0,
			localWebCreated: 0,
			blobMasterExists: 0,
			blobWebExists: 0,
			blobMasterCreated: 0,
			blobWebCreated: 0,
			errors: []
		};

		console.log(`📁 Processing ${imageFiles.length} files from ${absoluteDir}`);

		// Process files in batches to avoid memory issues
		for (let i = 0; i < imageFiles.length; i += BATCH_SIZE) {
			const batch = imageFiles.slice(i, i + BATCH_SIZE);
			console.log(
				`\n🔄 Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(imageFiles.length / BATCH_SIZE)}`
			);

			await Promise.all(
				batch.map((file) => {
					const fullPath = join(absoluteDir, file.name);
					return processFile(fullPath, stats, forceWeb);
				})
			);

			// Optional: Add garbage collection hint for large batches
			if (global.gc) global.gc();
		}

		console.log('\n✅ Processing complete!');

		return json({
			totalCount: imageFiles.length,
			...stats,
			summary: {
				successfulFiles: imageFiles.length - stats.errors.length,
				failedFiles: stats.errors.length
			}
		});
	} catch (error: any) {
		console.error('❌ CRITICAL ERROR:', error);
		return json(
			{
				error: 'Internal server error',
				details: error.message
			},
			{ status: 500 }
		);
	}
};
