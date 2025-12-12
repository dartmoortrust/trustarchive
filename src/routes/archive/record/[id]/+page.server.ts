import { db } from "$lib/server/db";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  const sql = `
		SELECT r.title, r.id, r.sha1_hash, r.detail, ST_asGeoJSON(r.location_geom)::json as geojson, r.downloadable,
		r.date_year, r.date_month, r.date_day, r.mime_type as file_mime,  r.collection_id, fm.medium,
		r.public, c.title as colname, c.code as colslug, r.location_estimated, r.transform::json
		from files r 
		LEFT JOIN fonds c on r.collection_id = c.id
		LEFT JOIN file_mimes fm on fm.mime_type = r.mime_type
		where r.id = $1
		LIMIT 1
	`;
  const data = await db.query(sql, [params.id]);
  console.log(data.rows[0]);
  return {
    record: data.rows[0],
  };
};
