// -----------------------------------------------------------------------------
// CRUD-Funktionen für "absences".
// -----------------------------------------------------------------------------

import { openDb } from "../lib/ensureDatabase.js";
import sqlite3 from "sqlite3";
import type {
  Absence,
  AbsenceInput,
  AbsenceUpdate,
} from "../types/absence.js";

type RunResult = sqlite3.RunResult;

export async function list(): Promise<Absence[]> {
  const db = await openDb();
  try {
    return await new Promise<Absence[]>((resolve, reject) => {
      db.all(
        "SELECT id, user_id, start_date, end_date, type, status, requested_at FROM absences ORDER BY requested_at DESC",
        [],
        (err, rows) => (err ? reject(err) : resolve(rows as Absence[])),
      );
    });
  } finally {
    db.close();
  }
}

export async function listByUser(userId: number): Promise<Absence[]> {
  const db = await openDb();
  try {
    return await new Promise<Absence[]>((resolve, reject) => {
      db.all(
        "SELECT id, user_id, start_date, end_date, type, status, requested_at FROM absences WHERE user_id = ? ORDER BY start_date DESC",
        [userId],
        (err, rows) => (err ? reject(err) : resolve(rows as Absence[])),
      );
    });
  } finally {
    db.close();
  }
}

export async function findById(id: number): Promise<Absence | undefined> {
  const db = await openDb();
  try {
    return await new Promise<Absence | undefined>((resolve, reject) => {
      db.get(
        "SELECT id, user_id, start_date, end_date, type, status, requested_at FROM absences WHERE id = ?",
        [id],
        (err, row) => (err ? reject(err) : resolve(row as Absence | undefined)),
      );
    });
  } finally {
    db.close();
  }
}

export async function create(
  input: AbsenceInput,
): Promise<Absence> {
  const db = await openDb();
  const status = input.status ?? "Pending";

  try {
    return await new Promise<Absence>((resolve, reject) => {
      db.run(
        "INSERT INTO absences (user_id, start_date, end_date, type, status) VALUES (?, ?, ?, ?, ?)",
        [input.user_id, input.start_date, input.end_date, input.type, status],
        function (this: RunResult, err) {
          if (err) return reject(err);
          db.get(
            "SELECT id, user_id, start_date, end_date, type, status, requested_at FROM absences WHERE id = ?",
            [this.lastID],
            (getErr, row) =>
              getErr ? reject(getErr) : resolve(row as Absence),
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
  changes: AbsenceUpdate,
): Promise<Absence | undefined> {
  const current = await findById(id);
  if (!current) return undefined;

  const updated: AbsenceUpdate = {
    start_date: changes.start_date ?? current.start_date,
    end_date: changes.end_date ?? current.end_date,
    type: changes.type ?? current.type,
    status: changes.status ?? current.status,
  };

  const db = await openDb();
  try {
    return await new Promise<Absence | undefined>((resolve, reject) => {
      db.run(
        "UPDATE absences SET start_date = ?, end_date = ?, type = ?, status = ? WHERE id = ?",
        [
          updated.start_date,
          updated.end_date,
          updated.type,
          updated.status,
          id,
        ],
        function (this: RunResult, err) {
          if (err) return reject(err);
          if (this.changes === 0) return resolve(undefined);

          db.get(
            "SELECT id, user_id, start_date, end_date, type, status, requested_at FROM absences WHERE id = ?",
            [id],
            (getErr, row) =>
              getErr ? reject(getErr) : resolve(row as Absence),
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
        "DELETE FROM absences WHERE id = ?",
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
