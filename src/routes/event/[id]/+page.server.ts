import { db } from "$lib/server/db";

export const load = async ({ params }) => {
  const events = await db.query("select * from posts where id = $1", [
    params.id,
  ]);
  return {
    event: events.rows[0],
  };
};
