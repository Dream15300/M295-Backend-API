import { openDb } from "../lib/ensureDatabase.js";
import sqlite3 from "sqlite3";
import type { User, UserPublic } from "../types/user.js";

type RunResult = sqlite3.RunResult;

export async function list(): Promise<UserPublic[]> {
  const db = await openDb();
  try {
    return await new Promise<UserPublic[]>((resolve, reject) => {
      db.all(
        "SELECT id, username, role FROM users ORDER BY id ASC",
        [],
        (err, rows) => (err ? reject(err) : resolve(rows as UserPublic[])),
      );
    });
  } finally {
    db.close();
  }
}

export async function findById(id: number): Promise<User | undefined> {
  const db = await openDb();
  try {
    return await new Promise<User | undefined>((resolve, reject) => {
      db.get(
        "SELECT id, username, password_hash, role, created_at FROM users WHERE id = ?",
        [id],
        (err, row) => (err ? reject(err) : resolve(row as User | undefined)),
      );
    });
  } finally {
    db.close();
  }
}

export async function findByUsername(
  username: string,
): Promise<User | undefined> {
  const db = await openDb();
  try {
    return await new Promise<User | undefined>((resolve, reject) => {
      db.get(
        "SELECT id, username, password_hash, role, created_at FROM users WHERE username = ?",
        [username],
        (err, row) => (err ? reject(err) : resolve(row as User | undefined)),
      );
    });
  } finally {
    db.close();
  }
}
