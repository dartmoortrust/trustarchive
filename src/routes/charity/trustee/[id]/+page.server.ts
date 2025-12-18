import { getTrustee } from "$lib/server/db";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  return {
    trustee: await getTrustee(params.id),
  };
};
