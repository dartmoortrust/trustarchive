import { Auth } from "$lib/server/auth";
import { redirect } from "@sveltejs/kit";
import type { Handle } from "@sveltejs/kit";

// Extend Locals type to include session
declare global {
  namespace App {
    interface Locals {
      session: {
        id: string;
        email: string;
        roles: string[];
        name: string;
      } | null;
    }
  }
}

export const handle: Handle = async ({ event, resolve }) => {
  const sessionId = event.cookies.get("sessionId");

  if (sessionId) {
    const session = await Auth.getSession(sessionId);
    event.locals.session = session
      ? {
          id: session.id,
          email: session.email,
          roles: session.roles,
          name: session.name,
        }
      : null;
  } else {
    event.locals.session = null;
  }
  if (event.url.pathname === "/archive/collection/31") {
    redirect(308, "/archive/collection/harrod");
  }
  if (event.url.pathname === "/archive/record/26967") {
    redirect(308, "/archive/record/2d3c240a-33f2-441f-a981-235cef537cb7");
  }
  if (event.url.pathname === "/archive/record/26967") {
    redirect(308, "/archive/record/9a4f3dfa-98c0-4696-91eb-cd1c4d3b2134");
  }
  return resolve(event);
};
