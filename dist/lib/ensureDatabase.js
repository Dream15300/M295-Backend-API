import path from "node:path";
import fs from "node:fs/promises";
import { constants as fsConstants } from "node:fs";
import sqlite3 from "sqlite3";
import { fileURLToPath } from "node:url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Vom kompilierten dist/infra nach Projektwurzel: zwei Ebenen hoch
const PROJECT_ROOT = path.resolve(__dirname, "..", "..");
// Standardpfade (anpassbar)
export const DB_RELATIVE = "data/database.sqlite3";
// Wird nicht mehr genutzt, bleibt nur wegen Funktionssignatur
export const INIT_SQL_RELATIVE = "data/init.sql";
// Verzeichnisse fuer Migrationen und Seeds
const MIGRATIONS_DIR_RELATIVE = "data/migrations";
const SEEDERS_DIR_RELATIVE = "data/seeders";
function absFromProject(relativePath) {
    return path.join(PROJECT_ROOT, relativePath);
}
async function fileExists(absPath) {
    try {
        await fs.access(absPath, fsConstants.F_OK);
        return true;
    }
    catch {
        return false;
    }
}
function execSql(db, sql) {
    return new Promise((resolve, reject) => {
        db.exec(sql, (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}
async function applySqlFilesInOrder(db, dirRelative) {
    const dirAbs = absFromProject(dirRelative);
    if (!(await fileExists(dirAbs))) {
        return;
    }
    const entries = await fs.readdir(dirAbs, { withFileTypes: true });
    const sqlFiles = entries
        .filter((e) => e.isFile() && e.name.toLowerCase().endsWith(".sql"))
        .map((e) => e.name)
        .sort();
    for (const fileName of sqlFiles) {
        const filePath = path.join(dirAbs, fileName);
        const sql = await fs.readFile(filePath, "utf8");
        if (sql.trim().length === 0)
            continue;
        await execSql(db, sql);
    }
}
export async function ensureDatabase(dbRel = DB_RELATIVE, _initSqlRel = INIT_SQL_RELATIVE) {
    const dbFile = absFromProject(dbRel);
    const dbDir = path.dirname(dbFile);
    await fs.mkdir(dbDir, { recursive: true });
    if (await fileExists(dbFile)) {
        // Bestehende DB verwenden
        return;
    }
    await new Promise((done, fail) => {
        const db = new sqlite3.Database(dbFile, (openErr) => {
            if (openErr) {
                fail(openErr);
                return;
            }
            db.exec("PRAGMA foreign_keys = ON;", async (pragmaErr) => {
                if (pragmaErr) {
                    db.close(() => { });
                    fail(pragmaErr);
                    return;
                }
                try {
                    await applySqlFilesInOrder(db, MIGRATIONS_DIR_RELATIVE);
                    await applySqlFilesInOrder(db, SEEDERS_DIR_RELATIVE);
                }
                catch (err) {
                    db.close(() => { });
                    fail(err);
                    return;
                }
                db.close((closeErr) => {
                    if (closeErr) {
                        fail(closeErr);
                        return;
                    }
                    done();
                });
            });
        });
    });
}
// Optional: DB oeffnen (mit PRAGMA), wenn eine Connection benötigt wird
export async function openDb(dbRel = DB_RELATIVE) {
    const dbFile = absFromProject(dbRel);
    return await new Promise((done, fail) => {
        const db = new sqlite3.Database(dbFile, (openErr) => {
            if (openErr) {
                fail(openErr);
                return;
            }
            db.exec("PRAGMA foreign_keys = ON;", (err) => {
                if (err) {
                    fail(err);
                    return;
                }
                done(db);
            });
        });
    });
}
//# sourceMappingURL=ensureDatabase.js.map