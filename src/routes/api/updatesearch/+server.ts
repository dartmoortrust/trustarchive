// import { PRIVATE_ALGOLIA_API_KEY } from "$env/static/private";
// import { PUBLIC_ALGOLIA_APP_ID } from "$env/static/public";
// import { db } from "$lib/server/db";
// import type { RequestHandler } from "@sveltejs/kit";
// import { algoliasearch } from "algoliasearch";

// const BATCH_SIZE = 10000;

// // 🔍 Algolia setup
// const algoliaClient = algoliasearch(
//   PUBLIC_ALGOLIA_APP_ID,
//   PRIVATE_ALGOLIA_API_KEY,
// );

// function chunkArray<T>(arr: T[], size: number): T[][] {
//   const chunks: T[][] = [];
//   for (let i = 0; i < arr.length; i += size) {
//     chunks.push(arr.slice(i, i + size));
//   }
//   return chunks;
// }

// export const GET: RequestHandler = async () => {
//   try {
//     // Step 1: Query all rows
//     const { rows } = await db.query("SELECT * from records");

//     if (!rows || rows.length === 0) {
//       return new Response(JSON.stringify({ message: "No records found" }), {
//         status: 200,
//       });
//     }

//     // Step 2: Map to Algolia records (must include `objectID`)
//     const records = rows.map((row) => ({
//       objectID: row.file_id, // Algolia requires this
//       ...row,
//     }));
//     const chunks = chunkArray(records, BATCH_SIZE);

//     // Step 3: Push to Algolia
//     for (const chunk of chunks) {
//       const response = await algoliaClient.saveObjects({
//         indexName: "records",
//         objects: records,
//       });
//       console.log(response);
//     }
//     return new Response(JSON.stringify({ message: "Indexed successfully" }), {
//       status: 200,
//     });
//   } catch (error) {
//     console.error(error);
//     return new Response(JSON.stringify({ error: "Failed to sync" }), {
//       status: 500,
//     });
//   }
// };
