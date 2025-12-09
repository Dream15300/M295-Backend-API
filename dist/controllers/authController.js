import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/authConfig.js";
import { findByUsername } from "../repo/userRepo.js";
export async function login(req, res, next) {
    try {
        const username = req.body?.username;
        const password = req.body?.password;
        if (!username || !password) {
            return res
                .status(400)
                .json({ fehler: "username und password sind erforderlich" });
        }
        const user = await findByUsername(username);
        if (!user) {
            return res.status(401).json({ fehler: "Ungültige Anmeldedaten" });
        }
        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) {
            return res.status(401).json({ fehler: "Ungültige Anmeldedaten" });
        }
        const payload = {
            id: user.id,
            username: user.username,
            role: user.role,
        };
        const token = jwt.sign(payload, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
        });
        return res.status(200).json({ token, user: payload });
    }
    catch (err) {
        next(err);
    }
}
/**
 * POST /logout
 * Bei JWT gibt es serverseitig nichts zu "zerstören".
 * Wir bestätigen nur, dass der Client sein Token verwerfen soll.
 */
export async function logout(_req, res, _next) {
    return res.status(200).json({ nachricht: "Logout erfolgreich. Token clientseitig löschen." });
}
//# sourceMappingURL=authController.js.map