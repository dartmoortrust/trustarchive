// src/lib/auth.js
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";
import { sendEmail } from "./email";
import { sql } from "bun";

export class Auth {
  static async setPassword(key: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const update =
      await sql`update users set password = ${hashedPassword}, reset_key = null where reset_key = ${key}`;
    if (update.rowCount === 1) {
      return true;
    }
    return { error: true, message: "Your reset key is not valid." };
  }
  static async resetPassword(email: string) {
    const salt = bcrypt.genSaltSync(10);
    const update =
      await sql`update users set reset_key = ${salt} where email = ${email}`;
    if (update.rowCount === 1) {
      const message = `To set a new password please click <a href='https://dartmoortrust.org/auth/reset?id=${salt}'>here</a>.`;
      await sendEmail(email.toLowerCase(), message);
      return true;
    }
    return false;
  }
  static async requireSession(event: any) {
    const sessionId = event.cookies.get("sessionId");
    if (!sessionId) {
      throw new Error("Authentication required");
    }

    const session = await Auth.getSession(sessionId);
    if (!session) {
      event.cookies.delete("sessionId", { path: "/" });
      throw new Error("Session expired or invalid");
    }

    return session;
  }
  static async login(email: string, password: string) {
    try {
      const rows = await sql`SELECT * FROM users WHERE email = ${email}`;

      const user = rows[0];
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error("Invalid credentials");
      }

      // Create session
      const sessionId = randomUUID();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      await sql`INSERT INTO sessions (id, user_id, expires_at) VALUES (${sessionId}, ${user.id}, ${expiresAt})`;

      return {
        sessionId,
        user: { id: user.id, email: user.email.toLowerCase(), name: user.name },
      };
    } catch (e) {
      console.error(e);
    }
  }

  static async signup(email: string, password: string, name: string) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const rows =
      await sql`INSERT INTO users (email, password,name) VALUES (${email.toLowerCase()}, ${hashedPassword}, ${name}) RETURNING id, email`;

    const user = rows[0];
    const sessionId = randomUUID();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await sql`INSERT INTO sessions (id, user_id, expires_at) VALUES (${sessionId}, ${user.id}, ${expiresAt})`;

    return { sessionId, user: { id: user.id, email: user.email } };
  }

  static async getSession(sessionId: string) {
    const rows = await sql`
      SELECT s.*, u.name, u.email, u.roles, u.id
      FROM sessions s 
      JOIN users u ON s.user_id = u.id 
      WHERE s.id = ${sessionId} AND s.expires_at > NOW()`;

    return rows[0] || null;
  }

  static async logout(sessionId: string) {
    await sql`DELETE FROM sessions WHERE id = ${sessionId}`;
  }
}
