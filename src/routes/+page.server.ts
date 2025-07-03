import { getRecord } from "$lib/server/db";
import type { PageServerLoad } from "./$types";

export const load = (async () => {
  const record = await getRecord(4567);
  return {
    record,
  };
}) satisfies PageServerLoad;
