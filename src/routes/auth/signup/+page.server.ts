import { Auth } from "$lib/server/auth";
import { fail, json } from "@sveltejs/kit";

export const actions = {
  default: async ({ request, cookies }) => {
    try {
      const data = await request.formData();
      const email = data.get("email");
      const password = data.get("password");
      const name = data.get("name");

      if (!email && !password) {
        return fail(400, {
          error: "You must provide both an email address and password.",
        });
      }

      const result = await Auth.signup(email, password, name);
      console.log(result);
      cookies.set("sessionId", result.sessionId, {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 1 day
      });

      return { success: true };
    } catch (error) {
      if (error.code === "23505") {
        return fail(400, {
          error:
            "You may already have an account - please try to login or reset your password.",
        });
      }
      return fail(400, { error: true, message: error.message });
    }
  },
};
