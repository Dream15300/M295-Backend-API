// -----------------------------------------------------------------------------
// CRUD-Funktionen für "absences".
// -----------------------------------------------------------------------------
import { openDb } from "../lib/ensureDatabase.js";
export async function list() {
    const db = await openDb();
    try {
        return await new Promise((resolve, reject) => {
            db.all("SELECT id, user_id, start_date, end_date, type, status, requested_at FROM absences ORDER BY requested_at DESC", [], (err, rows) => (err ? reject(err) : resolve(rows)));
        });
    }
    finally {
        db.close();
    }
}
export async function listByUser(userId) {
    const db = await openDb();
    try {
        return await new Promise((resolve, reject) => {
            db.all("SELECT id, user_id, start_date, end_date, type, status, requested_at FROM absences WHERE user_id = ? ORDER BY start_date DESC", [userId], (err, rows) => (err ? reject(err) : resolve(rows)));
        });
    }
    finally {
        db.close();
    }
}
export async function findById(id) {
    const db = await openDb();
    try {
        return await new Promise((resolve, reject) => {
            db.get("SELECT id, user_id, start_date, end_date, type, status, requested_at FROM absences WHERE id = ?", [id], (err, row) => (err ? reject(err) : resolve(row)));
        });
    }
    finally {
        db.close();
    }
}
export async function create(input) {
    const db = await openDb();
    const status = input.status ?? "Pending";
    try {
        return await new Promise((resolve, reject) => {
            db.run("INSERT INTO absences (user_id, start_date, end_date, type, status) VALUES (?, ?, ?, ?, ?)", [input.user_id, input.start_date, input.end_date, input.type, status], function (err) {
                if (err)
                    return reject(err);
                db.get("SELECT id, user_id, start_date, end_date, type, status, requested_at FROM absences WHERE id = ?", [this.lastID], (getErr, row) => getErr ? reject(getErr) : resolve(row));
            });
        });
    }
    finally {
        db.close();
    }
}
export async function update(id, changes) {
    const current = await findById(id);
    if (!current)
        return undefined;
    const updated = {
        start_date: changes.start_date ?? current.start_date,
        end_date: changes.end_date ?? current.end_date,
        type: changes.type ?? current.type,
        status: changes.status ?? current.status,
    };
    const db = await openDb();
    try {
        return await new Promise((resolve, reject) => {
            db.run("UPDATE absences SET start_date = ?, end_date = ?, type = ?, status = ? WHERE id = ?", [
                updated.start_date,
                updated.end_date,
                updated.type,
                updated.status,
                id,
            ], function (err) {
                if (err)
                    return reject(err);
                if (this.changes === 0)
                    return resolve(undefined);
                db.get("SELECT id, user_id, start_date, end_date, type, status, requested_at FROM absences WHERE id = ?", [id], (getErr, row) => getErr ? reject(getErr) : resolve(row));
            });
        });
    }
    finally {
        db.close();
    }
}
export async function remove(id) {
    const db = await openDb();
    try {
        return await new Promise((resolve, reject) => {
            db.run("DELETE FROM absences WHERE id = ?", [id], function (err) {
                if (err)
                    return reject(err);
                resolve(this.changes > 0);
            });
        });
    }
    finally {
        db.close();
    }
}
//# sourceMappingURL=absenceRepo.js.map