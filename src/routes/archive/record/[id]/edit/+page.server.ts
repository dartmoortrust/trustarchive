import { db } from "$lib/server/db";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, locals }) => {
  console.log("Loading Record Edit: ", params.id);

  const sql = `
		SELECT 
      r.title, r.original_id, r.id, r.sha1_hash, r.detail, ST_asGeoJSON(r.location_geom)::json as geojson, 
      r.caption_front, r.caption_back,
		  r.date_year, r.date_month, r.date_day, r.date_estimated, 
      c.title as col_name, r.collection_id, 
      r.transform::json
		from files r 
		JOIN fonds c on r.collection_id = c.id
		where r.id = $1
		LIMIT 1
	`;
  const data = await db.query(sql, [params.id]);
  const collections = await db.query("select id, title as name from fonds", []);
  // const media = await db.query("select * from media", []);
  // const past_edits = await db.query(
  //   "select id, updated_at, title from records where updated_by = $1 order by updated_at DESC",
  //   [locals?.session.email],
  // );
  return {
    record: data.rows[0],
    collections: collections.rows,
    media: [],
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
      console.log(values);
      const {
        record_id, //1
        title, //2
        detail, //3
        caption, //4
        caption_back, //5
        date_day, //6
        date_month, //7
        date_year, //8
        collection_id, //9
        original_id, //10
        // medium_id,
        geojson, //11
      } = values;
      // Perform the database update
      const UPDATE_RECORD_SQL = `UPDATE files
         SET title = $2,
          detail = $4,
          caption_front = $3,
          date_day = $5,
          date_month = $6,
          date_year = $7,
          collection_id = $8,
          original_id = $9,
          location_geom = ST_GeomFromGeoJSON($10),
          caption_back = $11
          WHERE id = $1`;
      const UPDATE_RECORD_VALUES = [
        record_id, //1
        title, //2
        caption, //3
        detail, //4
        date_day, //5
        date_month, //6
        date_year, //7
        collection_id, //8
        original_id, //9
        JSON.parse(geojson), //10
        caption_back, //11
      ];
      await db.query("BEGIN");
      await db.query(UPDATE_RECORD_SQL, UPDATE_RECORD_VALUES);
      // const UPDATE_EDIT_LOG_SQL = `
      //   INSERT INTO record_edits (record_id, user_id) VALUES ($1, $2)
      // `;
      // const UPDATE_EDIT_LOG_VALUES = [values.record_id, locals.session.id];
      // await db.query(UPDATE_EDIT_LOG_SQL, UPDATE_EDIT_LOG_VALUES);
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
