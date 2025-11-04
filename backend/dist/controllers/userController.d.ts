import { Request, Response } from 'express';
export declare class UserController {
    createUser(req: Request, res: Response): Promise<void>;
    getUserById(req: Request, res: Response): Promise<void>;
    getUserByEmail(req: Request, res: Response): Promise<void>;
    getAllUsers(req: Request, res: Response): Promise<void>;
    updateUser(req: Request, res: Response): Promise<void>;
    deleteUser(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=userController.d.ts.map