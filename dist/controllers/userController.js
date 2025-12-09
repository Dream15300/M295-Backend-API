import * as userRepo from "../repo/userRepo.js";
export async function listUsers(_req, res, next) {
    try {
        const users = await userRepo.list();
        return res.status(200).json(users);
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=userController.js.map