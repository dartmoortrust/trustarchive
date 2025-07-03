import { env } from "$env/dynamic/private";
import { db } from "$lib/server/db";
import type { PageServerLoad, Actions } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  const sql = `
		SELECT r.title, r.id, r.file_id, r.detail, ST_asGeoJSON(r.location_geom)::json as geojson,
		r.date_year, r.date_month, r.date_day, r.file_mime, r.transcription, r.image_negative, r.image_flip, r.image_flop, r.image_rotate,
		c.name as colname, c.id as colid
		from records r 
		JOIN collections c on r.collection_id = c.id
		where r.id = $1
		LIMIT 1
	`;
  const data = await db.query(sql, [params.id]);
  return {
    record: data.rows[0],
  };
};

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const token = data.get("cf-turnstile-response");
    const ip = request.headers.get("CF-Connecting-IP");
    console.log(token);
    // Validate the token by calling the "/siteverify" API.
    let formData = new FormData();
    formData.append("secret", env.CF_SECRET);
    formData.append("response", token);
    formData.append("remoteip", ip);

    const result = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        body: formData,
        method: "POST",
      },
    );

    const outcome = await result.json();
    console.log(outcome);
    if (outcome.success) {
      await db.query(
        `INSERT INTO comments(record_id, comment, name, email) values ($1,$2,$3,$4)`,
        [
          data.get("record_id"),
          data.get("feedback"),
          data.get("name"),
          data.get("email"),
        ],
      );
      //await sendEmail();

      return { success: "true" };
    } else {
      return { success: "false" };
    }
  },
} satisfies Actions;

export const prerender = false;
