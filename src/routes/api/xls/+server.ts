import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import * as XLSX from "xlsx";
import { sql } from "bun";

export const POST: RequestHandler = async ({ request }) => {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    // const collectionId = formData.get("collectionId") as String;
    if (!collectionId) {
      return json({ error: "No Collection ID Provided" });
    }
    if (!file) {
      return json({ error: "No file uploaded" }, { status: 400 });
    }

    // 1. Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // 2. Read the buffer using SheetJS
    const workbook = XLSX.read(arrayBuffer);

    // 3. Select a sheet (e.g., the first one)
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    // 4. Convert sheet data to a clean JSON array
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    // Log or process your data here
    for (const row of jsonData) {
      try {
        // 2. Use parameters ($1, $2) to prevent SQL Injection
        // Note: Syntax varies slightly by SQL driver (e.g., postgres.js uses ${})
        const results = await sql`
      SELECT id 
      FROM files 
      WHERE file_path LIKE ${"%" + row?.id + "%"} 
      LIMIT 1
    `;

        // 3. Handle the result (results is usually an array)
        const dbrow = results[0];

        if (dbrow) {
          console.log(`Row found: ${row.id} - ${dbrow.id}`);
          await sql`UPDATE files set `;
        } else {
          console.log(`No match for: ${row.id}`);
        }
      } catch (e) {
        console.error(`Error processing row ${row.id}:`, e);
      }
    }

    return json({
      message: "File processed successfully",
      data: jsonData,
    });
  } catch (error) {
    console.error("Error processing Excel:", error);
    return json({ error: "Failed to process the Excel file" }, { status: 500 });
  }
};
