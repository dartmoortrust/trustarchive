import { db } from "$lib/server/db";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ cookies }) => {
  const collections = await db.query(
    `select id, title, code from fonds order by title `,
  );

  return {
    collections: collections.rows,
  };
};
