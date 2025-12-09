import { openDb } from "../lib/ensureDatabase.js";
import sqlite3 from "sqlite3";
import { User } from "./../types/user.js";

type RunResult = sqlite3.RunResult;

/**
 * Liefert genau einen User anhand der E-Mail.
 * @params email
 */
export async function findByEmail(email: string): Promise<User | undefined> {
  const db = await openDb();
  try {
    return await new Promise<User | undefined>((resolve, reject) => {
      db.get(
        "SELECT id, email, password_hash, role FROM users WHERE email = ?",
        [email],
        (err, row) => (err ? reject(err) : resolve(row as User | undefined)),
      );
    });
  } finally {
    db.close();
  }
}
