import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import * as XLSX from "xlsx";
import { sql } from "bun";

export const POST: RequestHandler = async ({ request }) => {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const collectionId = formData.get("collectionId"); // Get the constraint

    if (!file || !collectionId) {
      return json({ error: "Missing file or collectionId" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

    // 1. Column Validation Setup
    const columnCheck = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'files'
    `;
    const validDbColumns = new Set(columnCheck.map((c) => c.column_name));

    const resultsSummary = [];

    // 2. Process within a Transaction
    await sql.begin(async (tx) => {
      for (const row of jsonData) {
        let status = "Success";
        let errorMessage = "";

        try {
          // Constrain search by both file_name AND collection_id
          const [dbrow] = await tx`
            SELECT id FROM files 
            WHERE file_path ILIKE ${"%" + (row.file_name || "") + "%"} 
            AND collection_id = ${collectionId}
            LIMIT 1
          `;

          if (dbrow) {
            const payload: Record<string, any> = {};
            for (const [key, value] of Object.entries(row)) {
              const dbKey = key.toLowerCase().trim().replace(/\s+/g, "_");

              // Ensure we don't accidentally overwrite system columns
              if (
                dbKey !== "file_name" &&
                dbKey !== "collection_id" &&
                validDbColumns.has(dbKey)
              ) {
                payload[dbKey] = value;
              }
            }

            const columns = Object.keys(payload);
            if (columns.length > 0) {
              await tx`UPDATE files SET ${tx(payload, ...columns)} WHERE id = ${dbrow.id}`;
            }
          } else {
            status = "Error";
            errorMessage = `No match for "${row.file_name}" in collection ${collectionId}`;
          }
        } catch (e: any) {
          status = "Error";
          errorMessage = e.message;
        }

        resultsSummary.push({
          ...row,
          import_status: status,
          import_error: errorMessage,
        });
      }
    });

    // 3. Generate Report
    const reportSheet = XLSX.utils.json_to_sheet(resultsSummary);
    const reportWorkbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(reportWorkbook, reportSheet, "Import Report");

    const reportBuffer = XLSX.write(reportWorkbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    return new Response(reportBuffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="import_report.xlsx"',
      },
    });
  } catch (error) {
    console.error(error);
    return json({ error: "Critical process failure" }, { status: 500 });
  }
};
