import { db } from "$lib/server/db";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, cookies }) => {
  const sql = `
		SELECT r.title, r.id, f.id as file_id, r.detail, ST_asGeoJSON(r.location_geom)::json as geojson, r.downloadable,
		r.date_year, r.date_month, r.date_day, f.mime_type as file_mime,  r.collection_id, 
		r.public, c.name as colname, c.slug as colslug, r.location_estimated, r.image_transform::json
		from records r 
		LEFT JOIN collections c on r.collection_id = c.id
		LEFT JOIN files f on r.file_id = f.id
		where r.id = $1
		LIMIT 1
	`;
  const data = await db.query(sql, [params.id]);
  console.log(data.rows[0]);
  return {
    record: data.rows[0],
  };
};
