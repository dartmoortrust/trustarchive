// src/lib/auth.js
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";
import { db } from "./db";
import { sendEmail } from "./notify";

export class Auth {
  static async setPassword(key: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const update = await db.query(
      `update users set password = $1, reset_key = null where reset_key = $2`,
      [hashedPassword, key],
    );
    if (update.rowCount === 1) {
      return true;
    }
    return { error: true, message: "Your reset key is not valid." };
  }
  static async resetPassword(email: string) {
    const salt = bcrypt.genSaltSync(10);
    const update = await db.query(
      `update users set reset_key = $1 where email = $2`,
      [salt, email],
    );
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
    const { rows } = await db.query("SELECT * FROM users WHERE email = $1", [
      email.toLowerCase(),
    ]);

    const user = rows[0];
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error("Invalid credentials");
    }

    // Create session
    const sessionId = randomUUID();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await db.query(
      "INSERT INTO sessions (id, user_id, expires_at) VALUES ($1, $2, $3)",
      [sessionId, user.id, expiresAt],
    );

    return {
      sessionId,
      user: { id: user.id, email: user.email.toLowerCase(), name: user.name },
    };
  }

  static async signup(email: string, password: string, name: string) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const { rows } = await db.query(
      "INSERT INTO users (email, password,name) VALUES ($1, $2, $3) RETURNING id, email",
      [email.toLowerCase(), hashedPassword, name],
    );

    const user = rows[0];
    const sessionId = randomUUID();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await db.query(
      "INSERT INTO sessions (id, user_id, expires_at) VALUES ($1, $2, $3)",
      [sessionId, user.id, expiresAt],
    );

    return { sessionId, user: { id: user.id, email: user.email } };
  }

  static async getSession(sessionId: string) {
    const { rows } = await db.query(
      "SELECT s.*, u.name, u.email, u.roles, u.id FROM sessions s JOIN users u ON s.user_id = u.id WHERE s.id = $1 AND s.expires_at > NOW()",
      [sessionId],
    );

    return rows[0] || null;
  }

  static async logout(sessionId: string) {
    await db.query("DELETE FROM sessions WHERE id = $1", [sessionId]);
  }
}
