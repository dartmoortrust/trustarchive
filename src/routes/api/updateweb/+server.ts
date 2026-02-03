import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { createHash } from "crypto";
import path from "path";
import fs from "fs/promises";
import sharp from "sharp";
import { sql } from "bun";

const STORAGE_ROOT = "/home/jamie/Code/output/";
const LOG_PATH = "./logs/import_log.csv";
const TABLE_NAME = "files";

export const POST: RequestHandler = async ({ request }) => {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const sendUpdate = async (data: object, isFirst = false) => {
        let payload = `data: ${JSON.stringify(data)}\n\n`;
        if (isFirst) {
          payload = ": " + " ".repeat(1024) + "\n" + payload;
        }
        controller.enqueue(encoder.encode(payload));
        await Bun.sleep(5); 
      };

      try {
        const formData = await request.formData();
        const localDir = formData.get("localDir") as string;
        const collectionId = formData.get("collectionId") as string;

        if (!collectionId) {
          await sendUpdate({ error: "collectionId is missing" }, true);
          return controller.close();
        }

        await sendUpdate({ status: "initializing", path: localDir }, true);

        // 1. Directory Check
        const filesInDir = await fs.readdir(localDir);
        await sendUpdate({ status: "directory_scanned", count: filesInDir.length });

        // 2. Locate CSV
        const csvFileName = filesInDir.find((f) => f.endsWith(".csv"));
        if (!csvFileName) {
          await sendUpdate({ error: "No CSV file found." });
          return controller.close();
        }

        const csvPath = path.join(localDir, csvFileName);
        
        // 3. Native CSV Parsing
        let rows: any[] = [];
        try {
          await sendUpdate({ status: "parsing_csv", file: csvFileName });
          const csvText = await Bun.file(csvPath).text();
          const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== "");
          
          const parseCSVLine = (line: string) => {
            const result = [];
            let cur = "";
            let inQuote = false;
            for (let i = 0; i < line.length; i++) {
              const char = line[i];
              if (char === '"') inQuote = !inQuote;
              else if (char === ',' && !inQuote) {
                result.push(cur.trim());
                cur = "";
              } else cur += char;
            }
            result.push(cur.trim());
            return result;
          };

          const headers = parseCSVLine(lines[0]);
          rows = lines.slice(1).map(line => {
            const values = parseCSVLine(line);
            const obj: any = {};
            headers.forEach((h, i) => obj[h] = values[i]);
            return obj;
          }).filter(r => r.file_name);
          
          await sendUpdate({ status: "metadata_extracted", rowCount: rows.length });
        } catch (e: any) {
          await sendUpdate({ error: `CSV Parse Error: ${e.message}` });
          return controller.close();
        }

        // 4. DB Schema Introspection (Getting types)
        await sendUpdate({ status: "introspecting_db_types" });
        const schemaInfo = await Bun.sql`
          SELECT column_name, data_type 
          FROM information_schema.columns 
          WHERE table_name = ${TABLE_NAME}
        `;
        
        // Map types for easy lookup
        const typeMap = new Map(schemaInfo.map(c => [c.column_name, c.data_type]));

        const results = [];
        await sendUpdate({ status: "processing_files" });

        // 5. Processing Loop
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          const fileName = row.file_name;
          if (!fileName) continue;

          try {
            const filePath = path.join(localDir, fileName);
            const fileHandle = Bun.file(filePath);
            
            if (!(await fileHandle.exists())) throw new Error(`File not found: ${fileName}`);

            const imgBuffer = await fileHandle.arrayBuffer();
            const fileHash = createHash("sha1").update(Buffer.from(imgBuffer)).digest("hex");
            const mimeType = fileHandle.type;

            // Storage logic
            const subDir = fileHash.substring(0, 2);
            const masterDir = path.join(STORAGE_ROOT, "master", subDir);
            await fs.mkdir(masterDir, { recursive: true });
            await Bun.write(path.join(masterDir, fileHash), imgBuffer);

            if (mimeType.startsWith("image/")) {
              const webDir = path.join(STORAGE_ROOT, "web", subDir);
              await fs.mkdir(webDir, { recursive: true });
              await sharp(Buffer.from(imgBuffer))
                .resize({ width: 1000, withoutEnlargement: true })
                .webp({ quality: 80 })
                .toFile(path.join(webDir, `w-${fileHash}`));
            }

            // 6. DYNAMIC TYPE CASTING
            const record: any = {};
            for (const [colName, dataType] of typeMap) {
              const rawValue = row[colName];

              // Skip columns not present in the CSV row unless they are our manual overrides
              if (rawValue === undefined) continue;

              // Handle Integer/Numeric casting
              if (dataType.includes("int") || dataType.includes("numeric") || dataType.includes("double")) {
                const num = Number(rawValue);
                record[colName] = isNaN(num) || rawValue === "" ? null : num;
              } 
              // Handle Boolean casting
              else if (dataType.includes("bool")) {
                record[colName] = rawValue.toLowerCase() === "true" || rawValue === "1";
              }
              // Default to String
              else {
                record[colName] = rawValue === "" ? null : rawValue;
              }
            }

            // Explicit overrides
            record.sha1_hash = fileHash;
            record.mime_type = mimeType;
            record.collection_id = collectionId;
            record.file_path = filePath;

            await Bun.sql`
              INSERT INTO ${sql(TABLE_NAME)} ${sql(record)} 
              ON CONFLICT (sha1_hash) DO UPDATE SET ${sql(record)}
            `;
            
            results.push({ fileName, status: "success", fileHash });
          } catch (err: any) {
            results.push({ fileName, status: "failure", errorMsg: err.message });
          }

          await sendUpdate({ 
            status: "progress", 
            current: i + 1, 
            total: rows.length, 
            lastProcessed: fileName 
          });
        }

        // Final Count Check
        const verifyCount = await Bun.sql`
           SELECT COUNT(*) FROM ${sql(TABLE_NAME)} WHERE collection_id = ${collectionId}
        `;
        
        await logToCsv(results);
        await sendUpdate({ 
          status: "complete", 
          dbVerifyCount: verifyCount[0].count,
          summary: { total: rows.length, success: results.filter(r=>r.status==='success').length } 
        });
        controller.close();
        
      } catch (error: any) {
        console.error("Endpoint Panic:", error);
        await sendUpdate({ error: `CRITICAL: ${error.message}` });
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
};

async function logToCsv(results: any[]) {
  try {
    await fs.mkdir(path.dirname(LOG_PATH), { recursive: true });
    if (!(await Bun.file(LOG_PATH).exists())) {
      await Bun.write(LOG_PATH, "timestamp,filename,hash,status,error\n");
    }
    const newRows = results.map(r => `${new Date().toISOString()},"${r.fileName}","${r.fileHash || ''}","${r.status}","${r.errorMsg || ''}"\n`).join("");
    await fs.appendFile(LOG_PATH, newRows);
  } catch (e) {
    console.error("Logger Failed:", e);
  }
}