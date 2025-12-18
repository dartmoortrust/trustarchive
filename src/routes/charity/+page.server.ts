import { getTrustees } from "$lib/server/db";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({}) => {
  return {
    trustees: await getTrustees(),
  };
};
