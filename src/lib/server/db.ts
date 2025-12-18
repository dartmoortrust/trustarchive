// lib/db.ts
import pkg from "pg";
import { env } from "$env/dynamic/private";
const { Pool } = pkg;

/**
 * Create a new connection pool to the database.
 */
export const db = new Pool({
  connectionString: env.DB_URL,
  max: 10,
  idleTimeoutMillis: 5000,
  connectionTimeoutMillis: 2000,
  ssl: {
    rejectUnauthorized: false,
  },
});

const runQuery = async (sql: string, params: any = []) => {
  try {
    const res = await db.query(sql, params);
    return res.rows || [];
  } catch (err) {
    console.log(err);
  }
};

export const getTrustees = async () => {
  const trustees = await runQuery(
    `select * from trustees where retired = false order by id`,
  );
  return trustees;
};

export const getTrustee = async (id: string) => {
  const trustees =
    (await runQuery(`SELECT * FROM trustees WHERE slug = $1`, [id])) ?? [];
  return trustees[0] ?? null;
};

export const getFile = async (file_id: string) => {
  try {
    const sql = "SELECT * from records where file_id = $1 limit 1";
    const values = [file_id];
    const data = await db.query(sql, values);
    return data.rows[0];
  } catch (err) {
    console.log(err);
  }
};

export const getCollections = async () => {
  try {
    const collections = await db.query(`
		  select id, title as name, code as slug from fonds where public = true  order by name
	  `);
    return collections.rows;
  } catch (e) {
    console.log(e);
  }
};

export const getCollection = async () => {
  const sql = "SELECT id, name from collections order by name";
  const data = await db.query(sql);
  return data.rows;
};

export const getRecord = async (id: string) => {
  try {
    const record = await db.query(
      `
      SELECT r.title, r.id, r.sha1_hash, r.detail, ST_asGeoJSON(r.location_geom)::json as geojson, r.downloadable,
      r.date_year, r.date_month, r.date_day, r.mime_type as file_mime,  r.collection_id, fm.medium,
      r.public, c.title as colname, c.code as colslug, r.location_estimated, r.transform::json, r.caption_front, r.caption_back
      from files r 
      LEFT JOIN fonds c on r.collection_id = c.id
      LEFT JOIN file_mimes fm on fm.mime_type = r.mime_type
      where r.id = $1
      LIMIT 1
    `,
      [id],
    );
    return record.rows[0];
  } catch (e) {
    console.log(e);

    return [];
  }
};

export const getRandomRecords = async (count: number) => {
  try {
    const sql =
      "SELECT file_mime, file_id, id, medium_id from records ORDER BY RANDOM() limit $1";
    const values = [count];
    const data = await db.query(sql, values);
    return data.rows;
  } catch (err) {
    console.log(err);
  }
};

export const saveComment = async (
  record_id: number,
  comment: string,
  name: string,
  email: string,
) => {
  try {
    const sql = `
			INSERT INTO comments(record_id, name, comment, email)
			VALUES($1, $2, $3, $4)
		`;
    const data = await db.query(sql, [record_id, name, comment, email]);
    //await sendEmail();
  } catch (err) {
    console.log(err);
  }
};
