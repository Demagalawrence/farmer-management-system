import { Request, Response } from 'express';
import { FarmerService } from '../services/farmerService';

// We'll create the service instance when needed to avoid initialization issues
let farmerService: FarmerService;

const getFarmerService = (): FarmerService => {
  if (!farmerService) {
    farmerService = new FarmerService();
  }
  return farmerService;
};

export class FarmerController {
  async createFarmer(req: Request, res: Response): Promise<void> {
    try {
      const service = getFarmerService();
      const farmer = await service.create(req.body);
      res.status(201).json({ success: true, data: farmer });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getFarmerById(req: Request, res: Response): Promise<void> {
    try {
      const service = getFarmerService();
      const { id } = req.params;
      const farmer = await service.findById(id);
      
      if (!farmer) {
        res.status(404).json({ success: false, message: 'Farmer not found' });
        return;
      }
      
      res.status(200).json({ success: true, data: farmer });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getFarmerByUserId(req: Request, res: Response): Promise<void> {
    try {
      const service = getFarmerService();
      const { userId } = req.params;
      const farmer = await service.findByUserId(userId);
      
      if (!farmer) {
        res.status(404).json({ success: false, message: 'Farmer not found' });
        return;
      }
      
      res.status(200).json({ success: true, data: farmer });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getAllFarmers(req: Request, res: Response): Promise<void> {
    try {
      const service = getFarmerService();
      const farmers = await service.findAll();
      res.status(200).json({ success: true, data: farmers });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async updateFarmer(req: Request, res: Response): Promise<void> {
    try {
      const service = getFarmerService();
      const { id } = req.params;
      const farmer = await service.update(id, req.body);
      
      if (!farmer) {
        res.status(404).json({ success: false, message: 'Farmer not found' });
        return;
      }
      
      res.status(200).json({ success: true, data: farmer });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async deleteFarmer(req: Request, res: Response): Promise<void> {
    try {
      const service = getFarmerService();
      const { id } = req.params;
      const result = await service.delete(id);
      
      if (!result) {
        res.status(404).json({ success: false, message: 'Farmer not found' });
        return;
      }
      
      res.status(200).json({ success: true, message: 'Farmer deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async addFieldToFarmer(req: Request, res: Response): Promise<void> {
    try {
      const service = getFarmerService();
      const { id } = req.params;
      const field = req.body;
      const farmer = await service.addField(id, field);
      
      if (!farmer) {
        res.status(404).json({ success: false, message: 'Farmer not found' });
        return;
      }
      
      res.status(200).json({ success: true, data: farmer });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}