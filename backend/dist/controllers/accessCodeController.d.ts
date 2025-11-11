import { Request, Response } from 'express';
declare class AccessCodeController {
    generateAccessCode: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getActiveAccessCodes: (req: Request, res: Response, next: import("express").NextFunction) => void;
    validateAndUseCode: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getAccessCodeHistory: (req: Request, res: Response, next: import("express").NextFunction) => void;
    expireAccessCode: (req: Request, res: Response, next: import("express").NextFunction) => void;
}
declare const _default: AccessCodeController;
export default _default;
//# sourceMappingURL=accessCodeController.d.ts.map