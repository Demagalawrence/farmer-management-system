import { Request, Response } from 'express';
export declare class HarvestController {
    createHarvest(req: Request, res: Response): Promise<void>;
    getHarvestById(req: Request, res: Response): Promise<void>;
    getHarvestsByFarmerId(req: Request, res: Response): Promise<void>;
    getHarvestsByFieldId(req: Request, res: Response): Promise<void>;
    getAllHarvests(req: Request, res: Response): Promise<void>;
    updateHarvest(req: Request, res: Response): Promise<void>;
    deleteHarvest(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=harvestController.d.ts.map