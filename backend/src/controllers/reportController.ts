import { Request, Response } from 'express';
import { ReportService } from '../services/reportService';

// We'll create the service instance when needed to avoid initialization issues
let reportService: ReportService;

const getReportService = (): ReportService => {
  if (!reportService) {
    reportService = new ReportService();
  }
  return reportService;
};

export class ReportController {
  async createReport(req: Request, res: Response): Promise<void> {
    try {
      const service = getReportService();
      const report = await service.create(req.body);
      res.status(201).json({ success: true, data: report });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getReportById(req: Request, res: Response): Promise<void> {
    try {
      const service = getReportService();
      const { id } = req.params;
      const report = await service.findById(id);
      
      if (!report) {
        res.status(404).json({ success: false, message: 'Report not found' });
        return;
      }
      
      res.status(200).json({ success: true, data: report });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getReportsByType(req: Request, res: Response): Promise<void> {
    try {
      const service = getReportService();
      const { type } = req.params;
      const reports = await service.findByType(type as any);
      res.status(200).json({ success: true, data: reports });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getReportsByUser(req: Request, res: Response): Promise<void> {
    try {
      const service = getReportService();
      const { userId } = req.params;
      const reports = await service.findByGeneratedBy(userId);
      res.status(200).json({ success: true, data: reports });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getAllReports(req: Request, res: Response): Promise<void> {
    try {
      const service = getReportService();
      const reports = await service.findAll();
      res.status(200).json({ success: true, data: reports });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async updateReport(req: Request, res: Response): Promise<void> {
    try {
      const service = getReportService();
      const { id } = req.params;
      const report = await service.update(id, req.body);
      
      if (!report) {
        res.status(404).json({ success: false, message: 'Report not found' });
        return;
      }
      
      res.status(200).json({ success: true, data: report });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async deleteReport(req: Request, res: Response): Promise<void> {
    try {
      const service = getReportService();
      const { id } = req.params;
      const result = await service.delete(id);
      
      if (!result) {
        res.status(404).json({ success: false, message: 'Report not found' });
        return;
      }
      
      res.status(200).json({ success: true, message: 'Report deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}