import { Request, Response } from 'express';
import { PaymentService } from '../services/paymentService';

// We'll create the service instance when needed to avoid initialization issues
let paymentService: PaymentService;

const getPaymentService = (): PaymentService => {
  if (!paymentService) {
    paymentService = new PaymentService();
  }
  return paymentService;
};

export class PaymentController {
  async requestPayment(req: Request, res: Response): Promise<void> {
    try {
      const service = getPaymentService();
      const body = {
        ...req.body,
        status: 'pending',
        requested_by: req.user ? (req.user.id as any) : undefined,
        requested_at: new Date(),
      } as any;
      const payment = await service.create(body);
      res.status(201).json({ success: true, data: payment });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
  async createPayment(req: Request, res: Response): Promise<void> {
    try {
      const service = getPaymentService();
      const payment = await service.create(req.body);
      res.status(201).json({ success: true, data: payment });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getPaymentById(req: Request, res: Response): Promise<void> {
    try {
      const service = getPaymentService();
      const { id } = req.params;
      const payment = await service.findById(id);
      
      if (!payment) {
        res.status(404).json({ success: false, message: 'Payment not found' });
        return;
      }
      
      res.status(200).json({ success: true, data: payment });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getPaymentsByFarmerId(req: Request, res: Response): Promise<void> {
    try {
      const service = getPaymentService();
      const { farmerId } = req.params;
      const payments = await service.findByFarmerId(farmerId);
      res.status(200).json({ success: true, data: payments });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getPaymentsByStatus(req: Request, res: Response): Promise<void> {
    try {
      const service = getPaymentService();
      const { status } = req.params;
      const payments = await service.findByStatus(status as any);
      res.status(200).json({ success: true, data: payments });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getAllPayments(req: Request, res: Response): Promise<void> {
    try {
      const service = getPaymentService();
      const payments = await service.findAll();
      res.status(200).json({ success: true, data: payments });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async updatePayment(req: Request, res: Response): Promise<void> {
    try {
      const service = getPaymentService();
      const { id } = req.params;
      const payment = await service.update(id, req.body);
      
      if (!payment) {
        res.status(404).json({ success: false, message: 'Payment not found' });
        return;
      }
      
      res.status(200).json({ success: true, data: payment });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async deletePayment(req: Request, res: Response): Promise<void> {
    try {
      const service = getPaymentService();
      const { id } = req.params;
      const result = await service.delete(id);
      
      if (!result) {
        res.status(404).json({ success: false, message: 'Payment not found' });
        return;
      }
      
      res.status(200).json({ success: true, message: 'Payment deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}