import { Request, Response } from 'express';
export declare class FarmerController {
    createFarmer(req: Request, res: Response): Promise<void>;
    getFarmerById(req: Request, res: Response): Promise<void>;
    getFarmerByUserId(req: Request, res: Response): Promise<void>;
    getAllFarmers(req: Request, res: Response): Promise<void>;
    updateFarmer(req: Request, res: Response): Promise<void>;
    deleteFarmer(req: Request, res: Response): Promise<void>;
    addFieldToFarmer(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=farmerController.d.ts.map