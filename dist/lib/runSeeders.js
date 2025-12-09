import fs from "fs";
import path from "path";
import { openDb } from "./ensureDatabase.js";
export async function runSeeders() {
    const db = await openDb();
    const seedersDir = path.resolve("data", "seeders");
    if (!fs.existsSync(seedersDir)) {
        console.log("Kein Seeder-Verzeichnis vorhanden.");
        return;
    }
    const files = fs
        .readdirSync(seedersDir)
        .filter((file) => file.endsWith(".sql"))
        .sort();
    console.log("Gefundene Seeder:", files);
    for (const file of files) {
        const fullPath = path.join(seedersDir, file);
        const sql = fs.readFileSync(fullPath, "utf8");
        console.log(`Starte Seeder: ${file}`);
        await new Promise((resolve, reject) => {
            db.exec(sql, (err) => {
                if (err) {
                    console.error(`Fehler im Seeder ${file}:`, err);
                    return reject(err);
                }
                console.log(`Seeder ausgeführt: ${file}`);
                resolve();
            });
        });
    }
    db.close();
}
//# sourceMappingURL=runSeeders.js.map