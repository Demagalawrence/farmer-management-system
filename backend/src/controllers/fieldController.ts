import { Request, Response } from 'express';
import { FieldService } from '../services/fieldService';

// We'll create the service instance when needed to avoid initialization issues
let fieldService: FieldService;

const getFieldService = (): FieldService => {
  if (!fieldService) {
    fieldService = new FieldService();
  }
  return fieldService;
};

export class FieldController {
  async createField(req: Request, res: Response): Promise<void> {
    try {
      const service = getFieldService();
      const field = await service.create(req.body);
      res.status(201).json({ success: true, data: field });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getFieldById(req: Request, res: Response): Promise<void> {
    try {
      const service = getFieldService();
      const { id } = req.params;
      const field = await service.findById(id);
      
      if (!field) {
        res.status(404).json({ success: false, message: 'Field not found' });
        return;
      }
      
      res.status(200).json({ success: true, data: field });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getFieldsByFarmerId(req: Request, res: Response): Promise<void> {
    try {
      const service = getFieldService();
      const { farmerId } = req.params;
      const fields = await service.findByFarmerId(farmerId);
      res.status(200).json({ success: true, data: fields });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getAllFields(req: Request, res: Response): Promise<void> {
    try {
      const service = getFieldService();
      const fields = await service.findAll();
      res.status(200).json({ success: true, data: fields });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async updateField(req: Request, res: Response): Promise<void> {
    try {
      const service = getFieldService();
      const { id } = req.params;
      const field = await service.update(id, req.body);
      
      if (!field) {
        res.status(404).json({ success: false, message: 'Field not found' });
        return;
      }
      
      res.status(200).json({ success: true, data: field });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async deleteField(req: Request, res: Response): Promise<void> {
    try {
      const service = getFieldService();
      const { id } = req.params;
      const result = await service.delete(id);
      
      if (!result) {
        res.status(404).json({ success: false, message: 'Field not found' });
        return;
      }
      
      res.status(200).json({ success: true, message: 'Field deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}