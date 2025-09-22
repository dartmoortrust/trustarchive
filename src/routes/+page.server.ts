import { db, getRecord } from "$lib/server/db";
import type { PageServerLoad } from "./$types";

export const load = (async () => {
  const events = await db.query("select * from posts");
  return {
    events: [],
  };
}) satisfies PageServerLoad;
