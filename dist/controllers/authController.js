import jwt from 'jsonwebtoken';
import { JWT_EXPIRES_IN, JWT_SECRET } from '../config/authConfig.js';
// später durch DB-Abfrage ersetzen
const demoUser = {
    id: 1,
    email: 'admin@example.com',
    password: 'hallo123456',
    role: 'admin',
};
export async function login(req, res, _next) {
    // zuerst Body, dann Query (so funktioniert GET & POST)
    const email = req.body?.email ??
        req.query.email;
    const password = req.body?.password ??
        req.query.password;
    if (!email || !password) {
        return res
            .status(400)
            .json({ fehler: 'email und password sind erforderlich' });
    }
    if (email !== demoUser.email || password !== demoUser.password) {
        return res.status(401).json({ fehler: 'Ungültige Anmeldedaten' });
    }
    const payload = {
        id: demoUser.id,
        email: demoUser.email,
        role: demoUser.role,
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    return res.status(200).json({ token, user: payload });
}
//# sourceMappingURL=authController.js.map