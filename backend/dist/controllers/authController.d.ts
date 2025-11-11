import { Request, Response } from 'express';
export declare class AuthController {
    login: (req: Request, res: Response, next: import("express").NextFunction) => void;
    register: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getProfile: (req: Request, res: Response, next: import("express").NextFunction) => void;
    changePassword: (req: Request, res: Response, next: import("express").NextFunction) => void;
    private generateAccessCode;
}
//# sourceMappingURL=authController.d.ts.map