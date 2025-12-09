import path from "node:path";
import fs from "node:fs/promises";
import { constants as fsConstants } from "node:fs";
import sqlite3 from "sqlite3";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "..", "..");

export const DB_RELATIVE = "data/database.sqlite3";

function absFromProject(relativePath: string) {
  return path.join(PROJECT_ROOT, relativePath);
}

async function fileExists(absPath: string) {
  try {
    await fs.access(absPath, fsConstants.F_OK);
    return true;
  } catch {
    return false;
  }
}

// nur noch für openDb benötigt – Initialisierung machen runMigrations/runSeeders
export async function openDb(
  dbRel: string = DB_RELATIVE,
): Promise<sqlite3.Database> {
  const dbFile = absFromProject(dbRel);
  const dbDir = path.dirname(dbFile);

  // falls Verzeichnis noch nicht existiert
  await fs.mkdir(dbDir, { recursive: true });

  return await new Promise<sqlite3.Database>((done, fail) => {
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
