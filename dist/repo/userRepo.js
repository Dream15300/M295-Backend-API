import { openDb } from "../lib/ensureDatabase.js";
export async function list() {
    const db = await openDb();
    try {
        return await new Promise((resolve, reject) => {
            db.all("SELECT id, username, role FROM users ORDER BY id ASC", [], (err, rows) => (err ? reject(err) : resolve(rows)));
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
            db.get("SELECT id, username, password_hash, role, created_at FROM users WHERE id = ?", [id], (err, row) => (err ? reject(err) : resolve(row)));
        });
    }
    finally {
        db.close();
    }
}
export async function findByUsername(username) {
    const db = await openDb();
    try {
        return await new Promise((resolve, reject) => {
            db.get("SELECT id, username, password_hash, role, created_at FROM users WHERE username = ?", [username], (err, row) => (err ? reject(err) : resolve(row)));
        });
    }
    finally {
        db.close();
    }
}
//# sourceMappingURL=userRepo.js.map