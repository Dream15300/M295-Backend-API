import { openDb } from "../lib/ensureDatabase.js";
/**
 * Liefert genau einen User anhand der E-Mail.
 * @params email
 */
export async function findByEmail(email) {
    const db = await openDb();
    try {
        return await new Promise((resolve, reject) => {
            db.get("SELECT id, email, password_hash, role FROM users WHERE email = ?", [email], (err, row) => (err ? reject(err) : resolve(row)));
        });
    }
    finally {
        db.close();
    }
}
//# sourceMappingURL=userRepo.js.map