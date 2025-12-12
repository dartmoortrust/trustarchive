import { db } from "$lib/server/db";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ cookies }) => {
  const collections = await db.query(
    `select id, title as name, code as slug from fonds where public = true  order by name `,
  );

  return {
    collections: collections.rows,
  };
};
