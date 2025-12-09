import * as timeEntryRepo from '../repo/timeEntryRepo.js';
import * as changeLogRepo from '../repo/changeLogRepo.js';
const VALID_TYPES = ['IN', 'OUT'];
/**
 * POST /api/time-entries
 * LB: Einen Eintrag erstellen kann jeder auch ohne Login.
 * Erwartet: { userId | user_id, type, comment? }
 * Timestamp wird serverseitig gesetzt (Stempelzeit = jetzt).
 */
export async function createTimeEntry(req, res, next) {
    try {
        const rawUserId = req.body?.userId ??
            req.body?.user_id;
        const type = req.body?.type;
        const comment = req.body?.comment ?? null;
        const userId = Number(rawUserId);
        if (!rawUserId || !Number.isFinite(userId) || userId <= 0) {
            return res
                .status(400)
                .json({ fehler: 'userId (oder user_id) muss eine gültige Zahl > 0 sein' });
        }
        if (!type || !VALID_TYPES.includes(type)) {
            return res
                .status(400)
                .json({ fehler: "type muss 'IN' oder 'OUT' sein" });
        }
        const timestamp = new Date().toISOString();
        const created = await timeEntryRepo.create({
            user_id: userId,
            timestamp,
            type,
            comment,
        });
        return res.status(201).json(created);
    }
    catch (err) {
        next(err);
    }
}
/**
 * PUT /api/time-entries/:id  (UC → nur Manager, über Router geschützt)
 * Erlaubt: timestamp, type, comment
 */
export async function updateTimeEntry(req, res, next) {
    try {
        const id = Number(req.params.id);
        if (!Number.isFinite(id) || id <= 0) {
            return res
                .status(400)
                .json({ fehler: 'Ungültige ID in der URL' });
        }
        const changes = {};
        if (req.body?.timestamp !== undefined) {
            const ts = String(req.body.timestamp);
            if (!ts) {
                return res
                    .status(400)
                    .json({ fehler: 'timestamp darf nicht leer sein' });
            }
            changes.timestamp = ts;
        }
        if (req.body?.type !== undefined) {
            const t = req.body.type;
            if (!VALID_TYPES.includes(t)) {
                return res
                    .status(400)
                    .json({ fehler: "type muss 'IN' oder 'OUT' sein" });
            }
            changes.type = t;
        }
        if (req.body?.comment !== undefined) {
            changes.comment =
                req.body.comment === null ? null : String(req.body.comment);
        }
        if (changes.timestamp === undefined &&
            changes.type === undefined &&
            changes.comment === undefined) {
            return res
                .status(400)
                .json({ fehler: 'Es wurden keine gültigen Felder zum Aktualisieren übermittelt' });
        }
        const updated = await timeEntryRepo.update(id, changes);
        if (!updated) {
            return res.status(404).json({ fehler: 'Zeit-Eintrag nicht gefunden' });
        }
        // Protokollierung (UC → Manager)
        const userId = req.user?.id;
        if (!userId) {
            return res
                .status(500)
                .json({ fehler: 'Kein Benutzer im Token gefunden' });
        }
        const logEntry = {
            changed_table: 'time_entries',
            changed_record_id: updated.id,
            changed_by: userId,
            change_type: 'Update',
            details: JSON.stringify(changes),
        };
        await changeLogRepo.create(logEntry);
        return res.status(200).json(updated);
    }
    catch (err) {
        next(err);
    }
}
/**
 * DELETE /api/time-entries/:id  (UC → nur Manager, über Router geschützt)
 */
export async function deleteTimeEntry(req, res, next) {
    try {
        const id = Number(req.params.id);
        if (!Number.isFinite(id) || id <= 0) {
            return res
                .status(400)
                .json({ fehler: 'Ungültige ID in der URL' });
        }
        const userId = req.user?.id;
        if (!userId) {
            return res
                .status(500)
                .json({ fehler: 'Kein Benutzer im Token gefunden' });
        }
        const deleted = await timeEntryRepo.remove(id);
        if (!deleted) {
            return res.status(404).json({ fehler: 'Zeit-Eintrag nicht gefunden' });
        }
        const logEntry = {
            changed_table: 'time_entries',
            changed_record_id: id,
            changed_by: userId,
            change_type: 'Delete',
            details: null,
        };
        await changeLogRepo.create(logEntry);
        return res.status(204).send();
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=timeEntryController.js.map