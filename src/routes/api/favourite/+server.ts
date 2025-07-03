import { json } from "@sveltejs/kit";
import { db } from "$lib/server/db";

export async function POST({ request, locals }) {
  const { record_id } = await request.json();

  let res = await db.query(
    `
      INSERT INTO saved_records(user_id, record_id)
      VALUES($1, $2)
      `,
    [locals.session.id, record_id],
  );
  console.log(res);
  return json({ success: true });
}
