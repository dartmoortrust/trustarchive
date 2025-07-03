import { db } from "$lib/server/db";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, locals }) => {
  console.log("Loading Record Edit: ", params.id);

  const sql = `
		SELECT r.title, r.original_id, r.id, r.file_id, r.detail, ST_asGeoJSON(r.location_geom)::json as geojson, r.caption, r.caption_rear,
		r.date_year, r.date_month, r.date_day, r.file_mime, r.transcription, r.file_path, c.name as col_name, r.collection_id, 
    r.medium_id, r.image_transform::json
		from records r 
		LEFT JOIN collections c on r.collection_id = c.id
		where r.id = $1
		LIMIT 1
	`;
  const data = await db.query(sql, [params.id]);
  const collections = await db.query("select id, name from collections", []);
  const media = await db.query("select * from media", []);
  const past_edits = await db.query(
    "select id, updated_at, title from records where updated_by = $1 order by updated_at DESC",
    [locals?.session.email],
  );
  console.log(past_edits);
  return {
    record: data.rows[0],
    collections: collections.rows,
    media: media.rows,
    user_edits: past_edits.rows,
  };
};

export const actions = {
  update: async ({ request, locals }) => {
    try {
      //Run transaction with updated record and entry into the record_edits table to record the action
      const data = await request.formData();
      const values = Object.fromEntries(
        Array.from(data.entries()).map(([key, value]) => [
          key,
          typeof value === "string"
            ? value.trim() === ""
              ? null
              : value.trim()
            : value,
        ]),
      );
      const {
        record_id,
        title,
        detail,
        caption,
        caption_rear,
        date_day,
        date_month,
        date_year,
        collection_id,
        original_id,
        medium_id,
        geojson,
        image_transform,
      } = values;
      // Perform the database update
      const UPDATE_RECORD_SQL = `UPDATE records
         SET title = $2,
          caption = $3,
          detail = $4,
          date_day = $5,
          date_month = $6,
          date_year = $7,
          collection_id = $8,
          original_id = $9,
          medium_id = $10,
          location_geom = ST_GeomFromGeoJSON($11),
          image_transform = $12,
          updated_by = $13,
          caption_rear = $14
          WHERE id = $1`;
      const UPDATE_RECORD_VALUES = [
        parseInt(record_id),
        title,
        caption,
        detail,
        date_day,
        date_month,
        date_year,
        parseInt(collection_id),
        original_id,
        medium_id,
        JSON.parse(geojson),
        JSON.parse(image_transform),
        locals.session.email,
        caption_rear
      ];
      await db.query("BEGIN");
      await db.query(UPDATE_RECORD_SQL, UPDATE_RECORD_VALUES);
      const UPDATE_EDIT_LOG_SQL = `
        INSERT INTO record_edits (record_id, user_id) VALUES ($1, $2)
      `;
      const UPDATE_EDIT_LOG_VALUES = [values.record_id, locals.session.id];
      await db.query(UPDATE_EDIT_LOG_SQL, UPDATE_EDIT_LOG_VALUES);
      await db.query("COMMIT");
      return { success: true };
    } catch (error) {
      console.error("Error updating record:", error);
      await db.query("ROLLBACK");
      return {
        success: false,
        error: "An error occurred while updating the record.",
      };
    }
  },
};

export const prerender = false;

// export const config = {
//   csrf: false,
// };
