import { db } from "$lib/server/db";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, cookies }) => {
  const sql = `
		SELECT r.title, r.id, r.detail, ST_asGeoJSON(r.location_geom)::json as geojson, r.downloadable,
		r.date_year, r.date_month, r.date_day, r.mime_type,  r.collection_id, r.ai_markdown,
		r.public, c.title as colname, c.code as colslug, r.location_estimated
		from files r 
		JOIN fonds c on r.collection_id = c.id
		where r.id = $1
		LIMIT 1
	`;
  const data = await db.query(sql, [params.id]);
  return {
    record: data.rows[0],
  };
};
