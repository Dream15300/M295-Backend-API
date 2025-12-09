import * as changeLogRepo from "../repo/changeLogRepo.js";
export async function getLogs(_req, res, next) {
    try {
        const logs = await changeLogRepo.list();
        return res.status(200).json(logs);
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=logController.js.map