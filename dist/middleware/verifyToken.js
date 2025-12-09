import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/authConfig.js';
export function verifyToken(req, res, next) {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ fehler: 'Kein Bearer-Token übermittelt' });
    }
    const token = authHeader.substring('Bearer '.length).trim();
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        return next();
    }
    catch {
        return res.status(401).json({ fehler: 'Ungültiger oder abgelaufener Token' });
    }
}
//# sourceMappingURL=verifyToken.js.map