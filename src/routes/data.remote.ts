import { form, getRequestEvent, query } from "$app/server";
import { recordSchema } from "$lib/schema";
import { error, redirect } from "@sveltejs/kit";
import { getSignedUrl } from "$lib/server/files";
import { cleanTrigramQuery, parseSearchQuery } from "$lib/tools";
import { DATABASE_URL } from "$env/static/private";
import * as v from 'valibot';

/**
 * We use the global 'Bun' object here. 
 * This prevents Vite from trying to bundle a 'bun' module that doesn't exist 
 * as a physical file, which is what causes the 'c is not a function' error.
 */
const sql = new Bun.SQL({
  url: DATABASE_URL,
  max: 5,
  idleTimeout: 30,
  maxLifetime: 0,
  connectionTimeout: 30,
  onconnect: () => {
    console.log("Connected to PostgreSQL");
  },
  onclose: () => {
    console.log("PostgreSQL connection closed");
  },
});

export const getTrustees = query(async () => {
  const rows =
    await sql`select * from trustees where retired = false order by id`;
  return rows;
});

export const getTrusteeById = query(v.string(), async (id: string) => {
  const rows =
    await sql`select * from trustees where retired = false and slug = ${id}`;
  return rows[0];
});

export const getCollections = query(async () => {
  return await sql`SELECT id, code, title from fonds order by title`;
});

export const placeSearch = query(v.string(), async (name: string) => {
  let places = await sql`
      SELECT name1, ST_GeoHash(geom, 9) as geohash
      FROM devonplaces
      WHERE name1 ilike ${`%` + name + `%`}
    `;
  return places;
});

export const getCollectionById = query(v.string(), async (id: string) => {
  const collections = await sql`SELECT * from fonds where code = ${id}`;
  return collections[0];
});

export const searchRecords = query(
  v.object({
    q: v.string(),
    collection_id: v.optional(v.string()),
    limit: v.number(),
    page: v.number(),
  }),
  async (query) => {
    const { limit, q, collection_id, page } = query;
    const offset = (page - 1) * limit;

    const parsedQuery = parseSearchQuery(q);
    const trigramQuery = cleanTrigramQuery(q);

    const collectionFilter = sql`AND collection_id = ${collection_id}`;
    const textFilter = sql`
      AND (
        ts @@ to_tsquery('english', ${parsedQuery})    
        OR title % ${trigramQuery}                     
        OR detail % ${trigramQuery}                    
        OR caption_front % ${trigramQuery}             
      )
    `;

    const records = await sql`
      WITH search_results AS (
        SELECT 
          id, title, detail, caption_front, mime_type, sha1_hash, transform,
          ts_rank_cd(ts, to_tsquery('english', ${parsedQuery}), 32) as exact_rank,
          (
            similarity(COALESCE(title, ''), ${trigramQuery}) * 3 +
            similarity(COALESCE(detail, ''), ${trigramQuery}) * 2 +
            similarity(COALESCE(caption_front, ''), ${trigramQuery}) * 1.5
          ) / 6.5 as combined_similarity,
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

    const fullCount = records[0]?.full_count ?? 0;

    return {
      records,
      pagination: {
        q, page, limit,
        full_count: fullCount,
        total_pages: Math.ceil(fullCount / limit),
      },
    };
  },
);

export const getRecordsByCollectionId = query(
  v.object({
    id: v.string(),
    limit: v.number(),
    page: v.number(),
  }),
  async (query) => {
    const { limit, page, id } = query;
    const offset = limit * (page || 1) - limit;

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

export const getRecord = query(v.string(), async (id) => {
  try {
    let records = await sql`
            SELECT 
              r.id, r.title, r.transform, r.sha1_hash,
              r.date_day::varchar, r.date_month::varchar, r.date_year::varchar,
              r.downloadable, r.caption_front, r.caption_back,
              r.location_name, r.location_estimated, r.original_id,
              r.detail, r.mime_type, r.date_estimated, r.public::bool, 
              c.title as colname, c.code as colslug, c.id as colid,
              ST_GeoHash(r.location_geom, 9) as geohash
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
  try {
    await sql.begin(async (tx) => {
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
            original_id = ${recordData.original_id},
            downloadable = ${recordData.downloadable},
            location_geom = ST_GeomFromGeoHash(${recordData.geohash}),
            location_name = ${recordData.location_name},
            public = ${recordData.public},
            transform = ${recordData.transform}::json
        WHERE id = ${recordData.id}
        RETURNING id
      `;
    });
    console.log("Record Saved")

    return { success: true };
  } catch (e) {
    console.log(e);
    return { success: false, message: "Failed to update record" };
  }
});

export const getDownloadUrl = query(v.string(), async (recordId) => {
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