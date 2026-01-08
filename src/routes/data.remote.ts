import { form, getRequestEvent, query } from "$app/server";
import { recordSchema } from "$lib/schema";
import { sql } from "bun";
import { error } from "@sveltejs/kit";
import z from "zod";
import { getSignedUrl } from "$lib/server/files";
import { cleanTrigramQuery, parseSearchQuery } from "$lib/tools";

export const getTrustees = query(async () => {
  const rows =
    await sql`select * from trustees where retired = false order by id`;

  return rows;
});

export const getTrusteeById = query(z.string(), async (id: string) => {
  const rows =
    await sql`select * from trustees where retired = false and slug = ${id}`;

  return rows[0];
});

export const getCollections = query(async () => {
  return await sql`SELECT id,code, title from fonds order by title`;
});

export const placeSearch = query(z.string(), async (name: string) => {
  let places = await sql`
      SELECT name1, ST_asGeoJSON(geom)::json->'coordinates' as coords
      FROM devonplaces
      WHERE name1 ilike ${`%` + name + `%`}
    `;
  console.log(places);
  return places;
});

export const getCollectionById = query(z.string(), async (id: string) => {
  const collections = await sql`SELECT * from fonds where code = ${id}`;
  return collections[0];
});

// data.remote.ts
export const searchRecords = query(
  z.object({
    q: z.string().trim().optional().default(""),
    collection_id: z.string().uuid().optional(), // Ensure uuid validation
    limit: z.number().positive().default(25),
    page: z.number().positive().default(1),
  }),
  async (query) => {
    const { limit, q, collection_id, page } = query;

    // Calculate offset: Page 1 = 0, Page 2 = 25, etc.
    const offset = (page - 1) * limit;

    const parsedQuery = parseSearchQuery(q); // For tsquery
    const trigramQuery = cleanTrigramQuery(q); // For similarity operators

    const collectionFilter = sql`AND collection_id = ${collection_id}`;
    const textFilter = sql`
      AND (
        ts @@ to_tsquery('english', ${parsedQuery})    -- FTS Match
        OR title % ${trigramQuery}                     -- Trigram Match (title)
        OR detail % ${trigramQuery}                    -- Trigram Match (detail)
        OR caption_front % ${trigramQuery}             -- Trigram Match (caption)
      )
    `;

    const records = await sql`
      WITH search_results AS (
        SELECT 
          id, 
          title, 
          detail, 
          caption_front, 
          mime_type, 
          sha1_hash, 
          transform,
          -- Full Text Search Rank
          ts_rank_cd(ts, to_tsquery('english', ${parsedQuery}), 32) as exact_rank,
          
          -- Trigram Similarity Score (Combined and Weighted)
          (
            similarity(COALESCE(title, ''), ${trigramQuery}) * 3 +
            similarity(COALESCE(detail, ''), ${trigramQuery}) * 2 +
            similarity(COALESCE(caption_front, ''), ${trigramQuery}) * 1.5
          ) / 6.5 as combined_similarity,
          
          -- Boolean check for an exact FTS match (boost results that matched FTS)
          CASE 
            WHEN ts @@ to_tsquery('english', ${parsedQuery}) THEN 1
            ELSE 0
          END as has_exact_match
        FROM files
        WHERE 
          public = true
          ${q ? textFilter : sql``}
          ${collection_id ? collectionFilter : sql``}
      )
      SELECT 
        sr.*,
        count(*) OVER()::int AS full_count,
        (exact_rank * 2 + combined_similarity * 1.5 + has_exact_match * 3) as rank
      FROM search_results sr
      ORDER BY rank DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;

    // Handle empty state gracefully
    const fullCount = records[0]?.full_count ?? 0;

    return {
      records,
      pagination: {
        q,
        page,
        limit,
        full_count: fullCount,
        total_pages: Math.ceil(fullCount / limit),
      },
    };
  },
);

export const getRecordsByCollectionId = query(
  z.object({
    id: z.uuid(),
    limit: z.number(),
    page: z.number(),
  }),
  async (query) => {
    const { limit, page = 4, id } = query;
    const offset = limit * page - limit;

    const records = await sql`
      SELECT title, sha1_hash, id, mime_type
      FROM files 
      WHERE collection_id = ${id}
      OFFSET ${offset}
      LIMIT ${limit}
    `;
    return records;
  },
);

export const getRecord = query(z.uuid(), async (id) => {
  try {
    let records = await sql`
            SELECT r.id, r.title, r.transform, r.sha1_hash, r.date_day, r.date_month, r.date_year, r.downloadable,
            r.caption_front, r.caption_back, r.location_name, r.location_estimated, r.original_id,
            ARRAY[ST_X(location_geom), ST_Y(location_geom)] as geom, r.detail, r.mime_type,    
            r.date_estimated, r.sha1_hash, r.mime_type, r.public, c.title as colname, c.code as colslug, c.id as colid,
            r.transform
            FROM files r
            JOIN fonds c on c.id = r.collection_id
            WHERE r.id = ${id}
        `;
    return records[0];
  } catch (e) {
    console.error(e);
  }
});

export const updateRecord = form(recordSchema, async (recordData) => {
  const { locals } = getRequestEvent();
  if (!locals.session?.roles.includes("record-edit")) {
    return error(500, { message: "Not allowed" });
  }
  console.log(locals.session);
  try {
    // Build GeoJSON only if coordinates exist
    let locationGeom = JSON.parse(recordData?.location_geom || "");
    console.log(locationGeom);
    let locationConditional = sql`ST_SetSRID(ST_MakePoint(${locationGeom[0]}::float8, ${locationGeom[1]}::float8), 4326)`;
    // if (recordData.location_geom) {
    //   const parsedGeom = JSON.parse(recordData.location_geom);
    //   locationGeom = [parsedGeom[0], parsedGeom[1]];
    // }
    let updatedBy = locals.session.email || "nobody";
    await sql.begin(async (tx) => {
      await tx`
        INSERT INTO edit_history(record_id, updated_by, record)
        VALUES (${recordData.id}, ${updatedBy}, ${recordData})
      `;
      await tx`
        UPDATE files
        SET
            title = ${recordData.title},
            caption_front = ${recordData.caption_front},
            caption_back = ${recordData.caption_back},
            detail = ${recordData.detail},
            date_day = ${recordData.date_day},
            date_month = ${recordData.date_month},
            date_year = ${recordData.date_year},
            date_estimated = ${recordData.date_estimated},
            transform = ${recordData.transform},
            location_geom = ${locationGeom !== "" ? locationConditional : sql``},
            location_name = ${recordData.location_name},
            location_estimated = ${recordData.location_estimated},
            original_id = ${recordData.original_id}
        WHERE id = ${recordData.id}
        RETURNING id
      `;
    });
    console.log("Saved");
    return { success: true };
  } catch (e) {
    console.log(e);
    return error(500, { message: "Failed to update record" });
  }
});

export const getDownloadUrl = query(z.uuid(), async (recordId) => {
  //checkuser
  const { locals } = getRequestEvent();

  let record =
    await sql`select id, sha1_hash, mime_type, downloadable from files where id = ${recordId}`;

  const isAuthenticated = locals.session?.roles?.includes("file-download");

  if (isAuthenticated || record[0].downloadable) {
    await sql`INSERT INTO log(message) VALUES (${{
      action: "download",
      file_id: record[0].id,
    }})`;
    const signedUrl = await getSignedUrl(
      record[0].sha1_hash,
      `${record[0].id}.${record[0].mime_type.split("/")[1]}`,
    );
    return { signedUrl };
  }
});
