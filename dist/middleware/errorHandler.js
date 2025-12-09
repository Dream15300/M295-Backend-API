export function errorHandler(err, _req, res, _next) {
    console.error(err);
    res.status(500).json({ fehler: 'Interner Serverfehler' });
}
//# sourceMappingURL=errorHandler.js.map