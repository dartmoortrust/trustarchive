import { getRecord } from "$lib/server/db";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  return {
    record: await getRecord(params.id),
  };
};
