import { getCollection, getCollections } from "$lib/server/db";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  return {
    collections: await getCollections(),
  };
};
