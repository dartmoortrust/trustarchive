import { Auth } from "$lib/server/auth";
import { fail, json } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url }) => {
  return {
    reset_key: url.searchParams.get("id"),
  };
};

export const actions = {
  sendemail: async ({ request, cookies }) => {
    try {
      const data = await request.formData();
      const email = data.get("email");

      if (!email) {
        return fail(400, {
          error: "You must provide an email address.",
        });
      }

      const result = await Auth.resetPassword(email);

      if (result) {
        return { success: true, message: "Please check your email address." };
      }

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
  setpassword: async ({ request, cookies }) => {
    try {
      const data = await request.formData();
      const password = data.get("password");
      const key = data.get("key");
      if (!password) {
        return fail(400, {
          error: "You must provide a new password.",
        });
      }

      const result = await Auth.setPassword(key, password);

      if (result) {
        return { success: true, message: "Password has been reset." };
      }

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
