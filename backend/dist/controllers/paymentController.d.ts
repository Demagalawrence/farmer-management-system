import { Request, Response } from 'express';
export declare class PaymentController {
    requestPayment(req: Request, res: Response): Promise<void>;
    createPayment(req: Request, res: Response): Promise<void>;
    getPaymentById(req: Request, res: Response): Promise<void>;
    getPaymentsByFarmerId(req: Request, res: Response): Promise<void>;
    getPaymentsByStatus(req: Request, res: Response): Promise<void>;
    getAllPayments(req: Request, res: Response): Promise<void>;
    updatePayment(req: Request, res: Response): Promise<void>;
    deletePayment(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=paymentController.d.ts.map