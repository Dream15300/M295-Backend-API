import fs from 'node:fs';
import https from 'node:https';
import app from './app.js';
import { ensureDatabase } from './lib/ensureDatabase.js';
const PORT = 5001;
const startServer = async () => {
    await ensureDatabase();
    const key = fs.readFileSync('./cert/server.key');
    const cert = fs.readFileSync('./cert/server.crt');
    https.createServer({ key, cert }, app).listen(PORT, () => {
        console.log(`✅ HTTPS-Server läuft auf https://localhost:${PORT}`);
    });
};
startServer().catch(console.error);
//# sourceMappingURL=server.js.map