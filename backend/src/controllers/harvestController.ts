import { Request, Response } from 'express';
import { HarvestService } from '../services/harvestService';

// We'll create the service instance when needed to avoid initialization issues
let harvestService: HarvestService;

const getHarvestService = (): HarvestService => {
  if (!harvestService) {
    harvestService = new HarvestService();
  }
  return harvestService;
};

export class HarvestController {
  async createHarvest(req: Request, res: Response): Promise<void> {
    try {
      const service = getHarvestService();
      const harvest = await service.create(req.body);
      res.status(201).json({ success: true, data: harvest });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getHarvestById(req: Request, res: Response): Promise<void> {
    try {
      const service = getHarvestService();
      const { id } = req.params;
      const harvest = await service.findById(id);
      
      if (!harvest) {
        res.status(404).json({ success: false, message: 'Harvest not found' });
        return;
      }
      
      res.status(200).json({ success: true, data: harvest });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getHarvestsByFarmerId(req: Request, res: Response): Promise<void> {
    try {
      const service = getHarvestService();
      const { farmerId } = req.params;
      const harvests = await service.findByFarmerId(farmerId);
      res.status(200).json({ success: true, data: harvests });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getHarvestsByFieldId(req: Request, res: Response): Promise<void> {
    try {
      const service = getHarvestService();
      const { fieldId } = req.params;
      const harvests = await service.findByFieldId(fieldId);
      res.status(200).json({ success: true, data: harvests });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getAllHarvests(req: Request, res: Response): Promise<void> {
    try {
      const service = getHarvestService();
      const harvests = await service.findAll();
      res.status(200).json({ success: true, data: harvests });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async updateHarvest(req: Request, res: Response): Promise<void> {
    try {
      const service = getHarvestService();
      const { id } = req.params;
      const harvest = await service.update(id, req.body);
      
      if (!harvest) {
        res.status(404).json({ success: false, message: 'Harvest not found' });
        return;
      }
      
      res.status(200).json({ success: true, data: harvest });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async deleteHarvest(req: Request, res: Response): Promise<void> {
    try {
      const service = getHarvestService();
      const { id } = req.params;
      const result = await service.delete(id);
      
      if (!result) {
        res.status(404).json({ success: false, message: 'Harvest not found' });
        return;
      }
      
      res.status(200).json({ success: true, message: 'Harvest deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}