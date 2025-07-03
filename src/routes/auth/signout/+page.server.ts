// src/routes/api/auth/logout/+server.js
import { Auth } from "$lib/server/auth";
import { redirect } from "@sveltejs/kit";

// export const load: PageServerLoad = async ({ cookies }) => {
//   const sessionId = cookies.get("sessionId");
//   if (sessionId) {
//     await Auth.logout(sessionId);
//     cookies.delete("sessionId", { path: "/" });
//     redirect(307, "/");
//   }
//   redirect(307, "/");
// };

export const actions = {
  default: async ({ cookies }) => {
    const sessionId = cookies.get("sessionId");
    if (sessionId) {
      await Auth.logout(sessionId);
      cookies.delete("sessionId", { path: "/" });
      redirect(302, "/");
    }
    redirect(302, "/");
  },
};
