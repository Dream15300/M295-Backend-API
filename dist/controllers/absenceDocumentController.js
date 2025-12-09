import fs from 'fs';
import path from 'path';
import * as absenceRepo from '../repo/absenceRepo.js';
import * as absenceDocumentRepo from '../repo/absenceDocumentRepo.js';
/**
 * POST /api/absences/:id/documents
 * - ID entspricht der Absenz-ID
 * - Dateien werden mit dem Schlüssel "files" übermittelt
 * - Benutzer wird aus JWT gelesen
 */
export async function uploadDocuments(req, res, next) {
    try {
        const absenceId = Number(req.params.id);
        if (!Number.isFinite(absenceId) || absenceId <= 0) {
            return res.status(400).json({ fehler: 'Ungültige Abwesenheits-ID in der URL' });
        }
        const absence = await absenceRepo.findById(absenceId);
        if (!absence) {
            return res.status(404).json({ fehler: 'Abwesenheitsantrag nicht gefunden' });
        }
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ fehler: 'Kein Benutzer im Token gefunden' });
        }
        const files = req.files ?? [];
        if (!files.length) {
            return res.status(400).json({ fehler: 'Es wurden keine Dateien hochgeladen' });
        }
        const createdDocs = [];
        for (const file of files) {
            const doc = await absenceDocumentRepo.create({
                absence_id: absenceId,
                filename: file.filename,
                original_name: file.originalname,
                mime_type: file.mimetype,
                size: file.size,
                uploaded_by: userId,
            });
            createdDocs.push(doc);
        }
        return res.status(201).json(createdDocs);
    }
    catch (err) {
        next(err);
    }
}
/**
 * GET /api/absences/:id/documents
 */
export async function listDocuments(req, res, next) {
    try {
        const absenceId = Number(req.params.id);
        if (!Number.isFinite(absenceId) || absenceId <= 0) {
            return res.status(400).json({ fehler: 'Ungültige Abwesenheits-ID in der URL' });
        }
        const absence = await absenceRepo.findById(absenceId);
        if (!absence) {
            return res.status(404).json({ fehler: 'Abwesenheitsantrag nicht gefunden' });
        }
        const docs = await absenceDocumentRepo.listByAbsence(absenceId);
        return res.status(200).json(docs);
    }
    catch (err) {
        next(err);
    }
}
/**
 * GET /api/absences/:id/documents/:docId
 * docId entspricht dem Dateinamen inklusive Endung.
 */
export async function downloadDocument(req, res, next) {
    try {
        const absenceId = Number(req.params.id);
        const filenameParam = req.params.docId;
        if (!Number.isFinite(absenceId) || absenceId <= 0) {
            return res.status(400).json({ fehler: 'Ungültige Abwesenheits-ID in der URL' });
        }
        if (!filenameParam) {
            return res.status(400).json({ fehler: 'Kein Dateiname angegeben' });
        }
        const doc = await absenceDocumentRepo.findByAbsenceAndFilename(absenceId, filenameParam);
        if (!doc) {
            return res.status(404).json({ fehler: 'Dokument nicht gefunden' });
        }
        const filePath = path.resolve('files', String(absenceId), doc.filename);
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ fehler: 'Datei auf dem Server nicht gefunden' });
        }
        return res.download(filePath, doc.original_name);
    }
    catch (err) {
        next(err);
    }
}
/**
 * DELETE /api/absences/:id/documents/:docId
 */
export async function deleteDocument(req, res, next) {
    try {
        const absenceId = Number(req.params.id);
        const filenameParam = req.params.docId;
        if (!Number.isFinite(absenceId) || absenceId <= 0) {
            return res.status(400).json({ fehler: 'Ungültige Abwesenheits-ID in der URL' });
        }
        if (!filenameParam) {
            return res.status(400).json({ fehler: 'Kein Dateiname angegeben' });
        }
        const doc = await absenceDocumentRepo.findByAbsenceAndFilename(absenceId, filenameParam);
        if (!doc) {
            return res.status(404).json({ fehler: 'Dokument nicht gefunden' });
        }
        const filePath = path.resolve('files', String(absenceId), doc.filename);
        const removed = await absenceDocumentRepo.removeByAbsenceAndFilename(absenceId, filenameParam);
        if (!removed) {
            return res.status(500).json({ fehler: 'Dokument konnte nicht gelöscht werden' });
        }
        if (fs.existsSync(filePath)) {
            try {
                fs.unlinkSync(filePath);
            }
            catch {
                // Falls die Datei nicht gelöscht werden kann, lassen wir den DB-Eintrag trotzdem entfernt.
            }
        }
        return res.status(204).send();
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=absenceDocumentController.js.map