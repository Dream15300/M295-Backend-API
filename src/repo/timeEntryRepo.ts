// -----------------------------------------------------------------------------
// CRUD-Funktionen für die Tabelle "time_entries" in SQLite.
// -----------------------------------------------------------------------------

import { openDb } from "../lib/ensureDatabase.js";
import sqlite3 from "sqlite3";
import type {
  TimeEntry,
  TimeEntryInput,
  TimeEntryUpdate,
} from "../types/timeEntry.js";

type RunResult = sqlite3.RunResult;

export async function listByUser(
  userId: number,
): Promise<TimeEntry[]> {
  const db = await openDb();
  try {
    return await new Promise<TimeEntry[]>((resolve, reject) => {
      db.all(
        "SELECT id, user_id, timestamp, type, comment FROM time_entries WHERE user_id = ? ORDER BY timestamp ASC",
        [userId],
        (err, rows) => (err ? reject(err) : resolve(rows as TimeEntry[])),
      );
    });
  } finally {
    db.close();
  }
}

export async function findById(id: number): Promise<TimeEntry | undefined> {
  const db = await openDb();
  try {
    return await new Promise<TimeEntry | undefined>((resolve, reject) => {
      db.get(
        "SELECT id, user_id, timestamp, type, comment FROM time_entries WHERE id = ?",
        [id],
        (err, row) => (err ? reject(err) : resolve(row as TimeEntry | undefined)),
      );
    });
  } finally {
    db.close();
  }
}

export async function create(
  input: TimeEntryInput,
): Promise<TimeEntry> {
  const db = await openDb();
  try {
    return await new Promise<TimeEntry>((resolve, reject) => {
      db.run(
        "INSERT INTO time_entries (user_id, timestamp, type, comment) VALUES (?, ?, ?, ?)",
        [input.user_id, input.timestamp, input.type, input.comment ?? null],
        function (this: RunResult, err) {
          if (err) return reject(err);
          db.get(
            "SELECT id, user_id, timestamp, type, comment FROM time_entries WHERE id = ?",
            [this.lastID],
            (getErr, row) =>
              getErr ? reject(getErr) : resolve(row as TimeEntry),
          );
        },
      );
    });
  } finally {
    db.close();
  }
}

export async function update(
  id: number,
  changes: TimeEntryUpdate,
): Promise<TimeEntry | undefined> {
  const current = await findById(id);
  if (!current) return undefined;

  const updated: TimeEntryInput = {
    user_id: changes.user_id ?? current.user_id,
    timestamp: changes.timestamp ?? current.timestamp,
    type: changes.type ?? current.type,
    comment:
      changes.comment !== undefined ? changes.comment : current.comment,
  };

  const db = await openDb();
  try {
    return await new Promise<TimeEntry | undefined>((resolve, reject) => {
      db.run(
        "UPDATE time_entries SET user_id = ?, timestamp = ?, type = ?, comment = ? WHERE id = ?",
        [
          updated.user_id,
          updated.timestamp,
          updated.type,
          updated.comment,
          id,
        ],
        function (this: RunResult, err) {
          if (err) return reject(err);
          if (this.changes === 0) return resolve(undefined);

          db.get(
            "SELECT id, user_id, timestamp, type, comment FROM time_entries WHERE id = ?",
            [id],
            (getErr, row) =>
              getErr ? reject(getErr) : resolve(row as TimeEntry),
          );
        },
      );
    });
  } finally {
    db.close();
  }
}

export async function remove(id: number): Promise<boolean> {
  const db = await openDb();
  try {
    return await new Promise<boolean>((resolve, reject) => {
      db.run(
        "DELETE FROM time_entries WHERE id = ?",
        [id],
        function (this: RunResult, err) {
          if (err) return reject(err);
          resolve(this.changes > 0);
        },
      );
    });
  } finally {
    db.close();
  }
}
