// import { db } from "$lib/server/db";
// import { addDocuments } from "$lib/server/search";
// import type { RequestHandler } from "@sveltejs/kit";

// const BATCH_SIZE = 10000;

// export const GET: RequestHandler = async() => {
//   try {
//     const records = await db.query(`
//       SELECT 
//         r.id::varchar, r.title, r.detail, r.caption, 
//         r.file_id, r.public::varchar, f.mime_type as file_mime, 
//         c.slug as colslug, c.name as colname
//       FROM records r
//       JOIN files f on r.file_id = f.id
//       JOIN collections c on r.collection_id = c.id
//       ORDER by r.id ASC
//       LIMIT 100`
//     )
//     await addDocuments("records", records.rows);
//     return new Response(JSON.stringify({ message: "Synced successfully" }), {
//       status: 200,
//     });
//   } catch (error) {
//     console.error(error);
//     return new Response(JSON.stringify({ error: "Failed to sync" }), {
//       status: 500,
//     });
//   }
// };
