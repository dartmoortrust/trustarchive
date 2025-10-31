import { db } from "$lib/server/db";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, locals }) => {
  if (!locals.session.roles.includes("admin")) {
    redirect(307, "/auth/login");
  }
  const [past_edits, users, comments] = await Promise.all([
    await db.query(
      `SELECT * from record_edits where user_id = $1 order by created_at desc`,
      [locals.session.id],
    ),
    await db.query(
      `select u.email, u.name, count(re.record_id) as count, u.roles
		from users u
		left join record_edits re 
		on re.user_id = u.id
		group by u.email, u.name,u.roles
	`,
    ),
    await db.query(`select * from comments order by created_at desc`),
  ]);
  return {
    past_edits: past_edits.rows,
    users: users.rows,
    comments: comments.rows,
  };
};
