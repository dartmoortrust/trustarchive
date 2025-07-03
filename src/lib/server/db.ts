// lib/db.ts
import pkg from "pg";
import { env } from "$env/dynamic/private";
const { Pool } = pkg;

/**
 * Create a new connection pool to the database.
 */
export const db = new Pool({
  connectionString: env.DB_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: {
    rejectUnauthorized: false,
  },
});

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

export const getCollection = async () => {
  const sql = "SELECT id, name from collections order by name";
  const data = await db.query(sql);
  return data.rows;
};

export const getRecord = async (id: number) => {
  const sql = `
		SELECT r.title, r.id, r.file_id, r.detail, ST_asGeoJSON(r.location_geom)::json as geojson, c.name as colname, c.id as colid
		from records r
		JOIN collections c on r.collection_id = c.id
		where r.id = $1
		LIMIT 1
	`;
  const data = await db.query(sql, [id]);
  return data.rows[0];
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
