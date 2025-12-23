import { form, getRequestEvent, query } from "$app/server";
import { recordSchema } from "$lib/schema";
import { db } from "$lib/server/db";
import { error } from "@sveltejs/kit";
import z from "zod";


export const getRecord = query(z.uuid(), async (id) => {
    try {
        let {rows} = await db.query(`
            SELECT r.id, r.title, r.transform, r.sha1_hash, r.date_day, r.date_month, r.date_year,
            r.caption_front, r.caption_back, r.location_name, r.location_estimated,
            ARRAY[ST_X(location_geom), ST_Y(location_geom)] as geom, r.detail,         
            r.date_estimated, r.sha1_hash, r.mime_type, r.public, c.title as colname, c.code as colslug, c.id as colid,
            r.transform
            FROM files r
            JOIN fonds c on c.id = r.collection_id
            WHERE r.id = $1
        `,[id]);
        console.log(rows[0])
        return rows[0]
    } catch(e) {
        console.error(e)
    }
});

export const updateRecord = form(
    recordSchema, 
    async (recordData) => {
        const  {locals}  = getRequestEvent();
        if(!locals.session?.roles.includes('record-edit')){
            return error(500, { message: "Not allowed" });
        }
        console.log(locals.session)
        try {
            // Build GeoJSON only if coordinates exist
            let locationGeom = JSON.parse(recordData?.location_geom || '')
            if (recordData.location_geom ) {
                const parsedGeom = JSON.parse(recordData.location_geom)
                locationGeom = [parsedGeom[0],parsedGeom[1]];
            }
            
            const query = `
                UPDATE files
                SET
                    title = $2,
                    caption_front = $3,
                    caption_back = $4,
                    detail = $5,
                    date_day = $6,
                    date_month = $7,
                    date_year = $8,
                    date_estimated = $9,
                    transform = $10,
                    location_geom = 
                        CASE
                            WHEN $11::float8 = 0.0 OR $11 IS NULL THEN NULL
                            WHEN $12::float8 = 0.0 OR $12 IS NULL THEN NULL
                            ELSE ST_SetSRID(ST_MakePoint($11::float8, $12::float8), 4326)
                        END,
                    location_name = $13,
                    location_estimated = $14
                WHERE id = $1
                RETURNING id
            `;
            const params = [
                recordData.id,
                recordData.title,
                recordData.caption_front,
                recordData.caption_back,
                recordData.detail, //5
                recordData.date_day,
                recordData.date_month,
                recordData.date_year,
                recordData.date_estimated,
                recordData.transform, //10
                locationGeom[0],
                locationGeom[1],
                recordData.location_name,
                recordData.location_estimated
            ];

            const result = await db.query(query, params);

            if (result.rowCount === 0) {
                return error(404, { message: "Record not found" });
            }

            return { success: true };

        } catch (e) {
            console.error('Error updating record:', e);
            return error(500, { message: "Failed to update record" });
        }
    }
);