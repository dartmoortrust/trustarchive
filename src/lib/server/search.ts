// import { TYPESENSE_API_KEY, TYPESENSE_HOST, TYPESENSE_PORT } from '$env/static/private';
// export const addDocuments = async (collection:string, documents: any[]) => {
//   const docs = documents.map(doc => JSON.stringify(doc)).join('\n');
//   let response = await fetch(`http://${TYPESENSE_HOST}:${TYPESENSE_PORT}/collections/${collection}/documents/import?action=upsert`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'text/plain',
//       'X-TYPESENSE-API-KEY': TYPESENSE_API_KEY
//     },
//     body: docs
//   })
//   const responseText = await response.text();
//   const statusLines = responseText
//       .split('\n')
//       .filter(line => line.trim() !== '');
//   const results = statusLines.map(line => {
//     try {
//         return JSON.parse(line);
//     } catch (e) {
//         // This should not happen if Typesense returns correctly
//         console.error("Failed to parse JSONL line:", line, e);
//         return { success: false, error: "Malformed JSONL line from Typesense" };
//     }
    
// });
// const successfulDocs = results.filter(r => r.success);
//     const failedDocs = results.filter(r => !r.success);
//     console.log(`Successfully indexed ${successfulDocs.length} documents.`);
//     if (failedDocs.length > 0) {
//         console.error(`Failed to index ${failedDocs.length} documents:`, failedDocs);
//     }
//     return results;
// }

// export const getHits = async (results: any) => {
//   return results.hits.map((hit: any) => hit.document);
// }

// export const searchRecords = async (query: string) => {
//   let response = await fetch(`http://${TYPESENSE_HOST}:${TYPESENSE_PORT}/collections/records/documents/search?q=${query}&per_page=50&query_by=title,caption,detail`, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//       'X-TYPESENSE-API-KEY': TYPESENSE_API_KEY
//     },
//   })
//   if (response.status === 200) {
//     const results = await response.json();
//     return results
//   } else {
//     console.error("Failed to search records:", await response.text());
//     return [];
//   }
// }

// export const getOneRecordById = async (id:string) => {
//   let response = await fetch(`http://${TYPESENSE_HOST}:${TYPESENSE_PORT}/collections/records/documents/${id}`, {
//     method: 'GET',
//     headers: {
//       'X-TYPESENSE-API-KEY': TYPESENSE_API_KEY
//     }
//   })
//   if (response.status === 200) {
//     const record = await response.json();
//     return record;
//   } else {
//     console.error(`Failed to fetch record ${id} from Typesense:`, await response.text());
//     return null;
//   }
// }