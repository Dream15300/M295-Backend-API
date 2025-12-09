// -----------------------------------------------------------------------------
// CRUD für change_logs – wird später von den Controllern benutzt, um
// INSERT/UPDATE/DELETE zu protokollieren.
// -----------------------------------------------------------------------------

import { openDb } from "../lib/ensureDatabase.js";
import sqlite3 from "sqlite3";
import type {
  ChangeLog,
  ChangeLogInput,
  ChangeLogUpdate,
} from "../types/changeLog.js";

type RunResult = sqlite3.RunResult;

export async function list(): Promise<ChangeLog[]> {
  const db = await openDb();
  try {
    return await new Promise<ChangeLog[]>((resolve, reject) => {
      db.all(
        "SELECT id, changed_table, changed_record_id, changed_by, change_time, change_type, details FROM change_logs ORDER BY change_time DESC",
        [],
        (err, rows) => (err ? reject(err) : resolve(rows as ChangeLog[])),
      );
    });
  } finally {
    db.close();
  }
}

export async function findById(
  id: number,
): Promise<ChangeLog | undefined> {
  const db = await openDb();
  try {
    return await new Promise<ChangeLog | undefined>((resolve, reject) => {
      db.get(
        "SELECT id, changed_table, changed_record_id, changed_by, change_time, change_type, details FROM change_logs WHERE id = ?",
        [id],
        (err, row) =>
          err ? reject(err) : resolve(row as ChangeLog | undefined),
      );
    });
  } finally {
    db.close();
  }
}

export async function create(
  input: ChangeLogInput,
): Promise<ChangeLog> {
  const db = await openDb();
  try {
    return await new Promise<ChangeLog>((resolve, reject) => {
      db.run(
        "INSERT INTO change_logs (changed_table, changed_record_id, changed_by, change_type, details) VALUES (?, ?, ?, ?, ?)",
        [
          input.changed_table,
          input.changed_record_id,
          input.changed_by,
          input.change_type,
          input.details ?? null,
        ],
        function (this: RunResult, err) {
          if (err) return reject(err);
          db.get(
            "SELECT id, changed_table, changed_record_id, changed_by, change_time, change_type, details FROM change_logs WHERE id = ?",
            [this.lastID],
            (getErr, row) =>
              getErr ? reject(getErr) : resolve(row as ChangeLog),
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
  changes: ChangeLogUpdate,
): Promise<ChangeLog | undefined> {
  const current = await findById(id);
  if (!current) return undefined;

  const updated: ChangeLogInput = {
    changed_table: changes.changed_table ?? current.changed_table,
    changed_record_id:
      changes.changed_record_id ?? current.changed_record_id,
    changed_by: changes.changed_by ?? current.changed_by,
    change_type: changes.change_type ?? current.change_type,
    details:
      changes.details !== undefined ? changes.details : current.details,
  };

  const db = await openDb();
  try {
    return await new Promise<ChangeLog | undefined>((resolve, reject) => {
      db.run(
        "UPDATE change_logs SET changed_table = ?, changed_record_id = ?, changed_by = ?, change_type = ?, details = ? WHERE id = ?",
        [
          updated.changed_table,
          updated.changed_record_id,
          updated.changed_by,
          updated.change_type,
          updated.details,
          id,
        ],
        function (this: RunResult, err) {
          if (err) return reject(err);
          if (this.changes === 0) return resolve(undefined);

          db.get(
            "SELECT id, changed_table, changed_record_id, changed_by, change_time, change_type, details FROM change_logs WHERE id = ?",
            [id],
            (getErr, row) =>
              getErr ? reject(getErr) : resolve(row as ChangeLog),
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
        "DELETE FROM change_logs WHERE id = ?",
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
