// src/lib/runMigrations.ts
import fs from "fs";
import path from "path";
import { openDb } from "./ensureDatabase.js";

export async function runMigrations() {
  const db = await openDb();

  const migrationsDir = path.resolve("data", "migrations");
  if (!fs.existsSync(migrationsDir)) {
    console.log("Kein Migrations-Verzeichnis vorhanden.");
    return;
  }

  const files = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort(); // sorgt für richtige Reihenfolge (001, 002, ...)

  console.log("Gefundene Migrationen:", files);

  for (const file of files) {
    const fullPath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(fullPath, "utf8");

    console.log(`Starte Migration: ${file}`);

    await new Promise<void>((resolve, reject) => {
      db.exec(sql, (err) => {
        if (err) {
          console.error(`Fehler in Migration ${file}:`, err);
          return reject(err);
        }
        console.log(`Migration ausgeführt: ${file}`);
        resolve();
      });
    });
  }

  db.close();
}
