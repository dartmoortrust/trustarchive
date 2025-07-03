import { db } from "$lib/server/db";
import type { PageServerLoad } from "../$types";

export const load = (async () => {
  const record = await db.query(`
    SELECT json_build_object(
        'type', 'FeatureCollection',
        'features', json_agg(json_build_object(
            'type', 'Feature',
            'geometry', ST_AsGeoJSON(location_geom)::json, 
            'properties', jsonb_build_object(
                'id', id,
                'title', title,
                'file_id', file_id
            )
        ))
    ) AS geojson
    FROM (
        SELECT location_geom, id, file_id, title
        FROM records     
        WHERE location_geom IS NOT NULL          
    ) AS row;
    `);
  return {
    records: record.rows[0].geojson,
  };
}) satisfies PageServerLoad;
