import { form, prerender, query } from "$app/server";
import { db } from "$lib/server/db";
import z from "zod";


export const getTrustees = prerender(async() => {
  const trustees = await db.query(`select * from trustees where retired = false order by id`)
  return trustees.rows
})

export const getTrusteeById = prerender(z.string(), async(id) => {
  const trustee = await db.query(`
        select * from trustees where slug = $1
    `,[id])
  return trustee.rows[0]
})

export const getCollections = query(async () => {
  const collections = await db.query(`
		select id, title as name, code as slug from fonds where public = true  order by name
	`);

  return collections.rows;
});

export const getRecord = query(z.uuid(), async (id) => {
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
  } catch(e) {
        console.log(e)

      return []
  }
  
 
});

export const updateRecord = form(
  z.object({
    id: z.uuid(),
    original_id: z.string(),
    title: z.string().min(5, { error: "Too short!" }),
    caption_front: z.string(),
    caption_back: z.string(),
    date_year: z.number().max(2025),
    date_month: z.number().max(31),
    date_day: z.number().max(31),
    date_estimated: z.boolean(),
    detail: z.string(),
    collection_id: z.uuid(),
  }),
  async (formData) => {
    console.log("Saving Record");
    console.log(formData);
  },
);
