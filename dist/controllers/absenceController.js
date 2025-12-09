import * as absenceRepo from '../repo/absenceRepo.js';
export async function getAbsences(req, res, next) {
    try {
        const absences = await absenceRepo.list();
        return res.status(200).json(absences);
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=absenceController.js.map