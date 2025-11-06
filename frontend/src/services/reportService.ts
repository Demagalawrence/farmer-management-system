import type { Report } from '../../../backend/src/models/Report';
import api from './api';

export const reportService = {
  // Create a new report
  createReport: async (reportData: Omit<Report, '_id' | 'created_at'>) => {
    const response = await api.post('/reports', reportData);
    return response.data;
  },

  // Get report by ID
  getReportById: async (id: string) => {
    const response = await api.get(`/reports/${id}`);
    return response.data;
  },

  // Get reports by type
  getReportsByType: async (type: 'harvest_summary' | 'payment_report' | 'performance') => {
    const response = await api.get(`/reports/type/${type}`);
    return response.data;
  },

  // Get reports by user ID
  getReportsByUserId: async (userId: string) => {
    const response = await api.get(`/reports/user/${userId}`);
    return response.data;
  },

  // Get all reports
  getAllReports: async () => {
    const response = await api.get('/reports');
    return response.data;
  },

  // Update report
  updateReport: async (id: string, reportData: Partial<Report>) => {
    const response = await api.put(`/reports/${id}`, reportData);
    return response.data;
  },

  // Delete report
  deleteReport: async (id: string) => {
    const response = await api.delete(`/reports/${id}`);
    return response.data;
  },
  
  // Manager charts: payments over time
  getPaymentChart: async (params?: { start?: string | Date; end?: string | Date; interval?: 'day' | 'month' | 'year' }) => {
    const { start, end, interval } = params || {};
    const response = await api.get('/reports/charts/payments', {
      params: {
        start: start ? new Date(start).toISOString() : undefined,
        end: end ? new Date(end).toISOString() : undefined,
        interval,
      }
    });
    return response.data;
  },

  // Manager charts: harvests over time
  getHarvestChart: async (params?: { start?: string | Date; end?: string | Date; interval?: 'day' | 'month' | 'year' }) => {
    const { start, end, interval } = params || {};
    const response = await api.get('/reports/charts/harvests', {
      params: {
        start: start ? new Date(start).toISOString() : undefined,
        end: end ? new Date(end).toISOString() : undefined,
        interval,
      }
    });
    return response.data;
  },
};