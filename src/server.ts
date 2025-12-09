import https from 'https';
import fs from 'fs';
import app from './app.js';

import { runMigrations } from './lib/runMigrations.js';
import { runSeeders } from './lib/runSeeders.js';

const PORT = 5001;

const startServer = async () => {
  // Datenbank korrekt initialisieren
  try {
    await runMigrations();
    console.log('Migrationen erfolgreich ausgeführt.');

    await runSeeders();
    console.log('Seeders erfolgreich ausgeführt.');
  } catch (err) {
    console.error('Fehler bei der DB-Initialisierung:', err);
    process.exit(1);
  }

  // HTTPS-Server starten
  const key = fs.readFileSync('./cert/server.key');
  const cert = fs.readFileSync('./cert/server.crt');

  https.createServer({ key, cert }, app).listen(PORT, () => {
    console.log(`✅ HTTPS-Server läuft auf https://localhost:${PORT}`);
  });
};

startServer().catch(console.error);
