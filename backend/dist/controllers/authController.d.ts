import { Request, Response } from 'express';
export declare class AuthController {
    login(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    register(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=authController.d.ts.map