import { db } from "$lib/server/db";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  const sql = `
        select * from trustees where slug = $1
    `;
  const data = await db.query(sql, [params.id]);
  return {
    trustee: data.rows[0],
  };
};
