import { db } from "$lib/server/db";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ cookies }) => {
  const records = await db.query(`
        SELECT id, image_transform, file_id, file_mime from records order by RANDOM() limit 10`);
  const collections = await db.query(
    `select id, name, slug from collections  order by name `,
  );

  return {
    records: records.rows,
    collections: collections.rows,
  };
};
