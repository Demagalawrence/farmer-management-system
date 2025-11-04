import { Request, Response } from 'express';
export declare class ReportController {
    createReport(req: Request, res: Response): Promise<void>;
    getReportById(req: Request, res: Response): Promise<void>;
    getReportsByType(req: Request, res: Response): Promise<void>;
    getReportsByUser(req: Request, res: Response): Promise<void>;
    getAllReports(req: Request, res: Response): Promise<void>;
    updateReport(req: Request, res: Response): Promise<void>;
    deleteReport(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=reportController.d.ts.map