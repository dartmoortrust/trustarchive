import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { createHash } from "crypto";
import path from "path";
import fs from "fs/promises";
import sharp from "sharp";
import * as XLSX from "xlsx";
import { sql } from "bun";

const STORAGE_ROOT = "/home/jamie/Code/output/";
const LOG_PATH = "./logs/import_log.csv";
const TABLE_NAME = "files";

export const POST: RequestHandler = async ({ request }) => {
  try {
    const formData = await request.formData();
    const localDir = formData.get("localDir") as string;
    const collectionId = formData.get("collectionId") as string;

    if (!localDir)
      return json({ error: "localDir is required" }, { status: 400 });

    // 1. Find the XLS file in the source path
    const filesInDir = await fs.readdir(localDir);
    const xlsFileName = filesInDir.find(
      (f) => f.endsWith(".xlsx") || f.endsWith(".xls"),
    );

    if (!xlsFileName) {
      return json(
        { error: "No XLS file found in the source directory" },
        { status: 400 },
      );
    }

    // 2. Parse the XLS metadata
    const xlsPath = path.join(localDir, xlsFileName);
    const workbook = XLSX.readFile(xlsPath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet) as any[];

    // 3. Validate Headers against DB
    const xlsHeaders = Object.keys(rows[0] || {});
    const dbColumns = await sql`
            SELECT column_name FROM information_schema.columns WHERE table_name = ${TABLE_NAME}
        `;
    const dbColumnNames = dbColumns.map((c) => c.column_name);
    const missing = xlsHeaders.filter((h) => !dbColumnNames.includes(h));

    if (missing.length > 0) {
      return json(
        { error: `DB missing columns: ${missing.join(", ")}` },
        { status: 400 },
      );
    }

    const results = [];

    // 4. Process assets listed in XLS
    for (const row of rows) {
      const fileName = row.file_name;
      if (!fileName) continue;

      const filePath = path.join(localDir, fileName);
      let status = "success";
      let errorMsg = "";
      let fileHash = "";

      try {
        const fileHandle = Bun.file(filePath);
        if (!(await fileHandle.exists())) throw new Error("File not found");

        const fileBuffer = await fileHandle.arrayBuffer();
        fileHash = createHash("sha1")
          .update(Buffer.from(fileBuffer))
          .digest("hex");
        const mimeType = fileHandle.type;

        // Storage path logic (e.g., ab/hash)
        const subDir = fileHash.substring(0, 2);
        let masterDir = path.join(STORAGE_ROOT, "/master/", subDir);
        await fs.mkdir(masterDir, { recursive: true });

        // Save Original
        await Bun.write(path.join(masterDir, fileHash), fileBuffer);

        // Save WebP version if image
        const webDir = path.join(STORAGE_ROOT, "/web/", subDir);
        await fs.mkdir(webDir, { recursive: true });

        if (mimeType.startsWith("image/")) {
          await sharp(Buffer.from(fileBuffer))
            .resize({ width: 1000, withoutEnlargement: true })
            .webp({ quality: 80 })
            .toFile(path.join(webDir, `w-${fileHash}`));
        }

        // 5. Database Upsert
        const record = {
          ...row,
          sha1_hash: fileHash,
          mime_type: mimeType,
          collection_id: collectionId,
          file_path: filePath,
        };

        await sql`
                    INSERT INTO ${sql(TABLE_NAME)} ${sql(record)}
                    ON CONFLICT (sha1_hash) DO UPDATE SET ${sql(record)}
                `;
      } catch (err: any) {
        status = "failure";
        errorMsg = err.message;
      }
      results.push({ fileName, fileHash, status, errorMsg });
    }

    // 6. Final Log
    await logToCsv(results);

    return json({
      message: "Import complete",
      total: rows.length,
      success: results.filter((r) => r.status === "success").length,
    });
  } catch (error: any) {
    return json({ error: error.message }, { status: 500 });
  }
};

async function logToCsv(results: any[]) {
  await fs.mkdir(path.dirname(LOG_PATH), { recursive: true });
  const logFile = Bun.file(LOG_PATH);
  const header = "timestamp,filename,hash,status,error\n";
  const newRows =
    results
      .map(
        (r) =>
          `${new Date().toISOString()},"${r.fileName}","${r.fileHash}","${r.status}","${r.errorMsg}"`,
      )
      .join("\n") + "\n";

  if (!(await logFile.exists())) {
    await Bun.write(LOG_PATH, header + newRows);
  } else {
    const existing = await logFile.text();
    await Bun.write(LOG_PATH, existing + newRows);
  }
}
