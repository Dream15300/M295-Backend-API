import { openDb } from '../lib/ensureDatabase.js';
export async function listByAbsence(absenceId) {
    const db = await openDb();
    try {
        return await new Promise((resolve, reject) => {
            db.all(`SELECT id, absence_id, filename, original_name, mime_type, size,
                uploaded_by, uploaded_at
         FROM absence_documents
         WHERE absence_id = ?
         ORDER BY uploaded_at DESC`, [absenceId], (err, rows) => (err ? reject(err) : resolve(rows)));
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
            db.get(`SELECT id, absence_id, filename, original_name, mime_type, size,
                uploaded_by, uploaded_at
         FROM absence_documents
         WHERE id = ?`, [id], (err, row) => (err ? reject(err) : resolve(row)));
        });
    }
    finally {
        db.close();
    }
}
export async function findByAbsenceAndFilename(absenceId, filename) {
    const db = await openDb();
    try {
        return await new Promise((resolve, reject) => {
            db.get(`SELECT id, absence_id, filename, original_name, mime_type, size,
                uploaded_by, uploaded_at
         FROM absence_documents
         WHERE absence_id = ? AND filename = ?`, [absenceId, filename], (err, row) => (err ? reject(err) : resolve(row)));
        });
    }
    finally {
        db.close();
    }
}
export async function create(input) {
    const db = await openDb();
    try {
        return await new Promise((resolve, reject) => {
            db.run(`INSERT INTO absence_documents
           (absence_id, filename, original_name, mime_type, size, uploaded_by)
         VALUES (?, ?, ?, ?, ?, ?)`, [
                input.absence_id,
                input.filename,
                input.original_name,
                input.mime_type,
                input.size,
                input.uploaded_by,
            ], function (err) {
                if (err)
                    return reject(err);
                db.get(`SELECT id, absence_id, filename, original_name, mime_type, size,
                    uploaded_by, uploaded_at
             FROM absence_documents
             WHERE id = ?`, [this.lastID], (getErr, row) => getErr ? reject(getErr) : resolve(row));
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
        absence_id: changes.absence_id ?? current.absence_id,
        filename: changes.filename ?? current.filename,
        original_name: changes.original_name ?? current.original_name,
        mime_type: changes.mime_type ?? current.mime_type,
        size: changes.size ?? current.size,
        uploaded_by: changes.uploaded_by ?? current.uploaded_by,
    };
    const db = await openDb();
    try {
        return await new Promise((resolve, reject) => {
            db.run(`UPDATE absence_documents
         SET absence_id = ?, filename = ?, original_name = ?, mime_type = ?,
             size = ?, uploaded_by = ?
         WHERE id = ?`, [
                updated.absence_id,
                updated.filename,
                updated.original_name,
                updated.mime_type,
                updated.size,
                updated.uploaded_by,
                id,
            ], function (err) {
                if (err)
                    return reject(err);
                if (this.changes === 0)
                    return resolve(undefined);
                db.get(`SELECT id, absence_id, filename, original_name, mime_type, size,
                    uploaded_by, uploaded_at
             FROM absence_documents
             WHERE id = ?`, [id], (getErr, row) => getErr ? reject(getErr) : resolve(row));
            });
        });
    }
    finally {
        db.close();
    }
}
export async function removeByAbsenceAndFilename(absenceId, filename) {
    const db = await openDb();
    try {
        return await new Promise((resolve, reject) => {
            db.run(`DELETE FROM absence_documents
         WHERE absence_id = ? AND filename = ?`, [absenceId, filename], function (err) {
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
//# sourceMappingURL=absenceDocumentRepo.js.map