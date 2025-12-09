export function requireRole(role) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ fehler: 'Nicht angemeldet' });
        }
        if (!req.user.role) {
            return res.status(403).json({ fehler: 'Rolle nicht gesetzt' });
        }
        if (req.user.role !== role) {
            return res.status(403).json({ fehler: 'Keine Berechtigung' });
        }
        return next();
    };
}
//# sourceMappingURL=requireRole.js.map