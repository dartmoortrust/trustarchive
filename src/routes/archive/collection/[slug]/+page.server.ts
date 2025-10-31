import { db } from "$lib/server/db";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url, params }) => {
  const collection = await db.query(
    `SELECT * from fonds where code = $1`,
    [params.slug], // Fixed: Use `slug` instead of `id`
  );
  const page = Number(url.searchParams.get("page")) || 1;
  const per_page = Number(url.searchParams.get("per_page")) || 25;
  const offset = per_page * (page - 1);

  const records = await db.query(
    `
    SELECT r.title, r.id, r.detail, r.mime_type, 
      count(*) OVER()::int AS full_count, r.mime_type,
      r.date_year, r.date_month, r.date_day
    FROM files r 
    WHERE r.collection_id = $1
      AND r.public = true
    OFFSET $2
    LIMIT $3
    `,
    [collection.rows[0].id, offset, per_page],
  );

  const total_count = records.rows.length ? records.rows[0].full_count : 0;
  const page_count = total_count ? Math.ceil(total_count / per_page) : 0;

  return {
    collection: collection.rows[0],
    records: records.rows,
    pagination: {
      page,
      per_page,
      total_count,
      page_count,
    },
  };
};
