import type { Report } from '../../../backend/src/models/Report';
import type { GenerateReportRequest, GenerateReportResponse, UserReportsResponse, ReportRecipient } from '../types/reports';
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

  // ====== Formal Report Functions ======
  
  // Generate formal financial PDF report
  generateFormalReport: async (request: GenerateReportRequest): Promise<GenerateReportResponse> => {
    const response = await api.post('/formal-reports/generate-formal-report', request);
    return response.data;
  },

  // Get user's formal reports
  getUserReports: async (page: number = 1, limit: number = 20): Promise<UserReportsResponse> => {
    const response = await api.get('/formal-reports/user-reports', {
      params: { page, limit }
    });
    return response.data;
  },

  // Get available recipients for report distribution
  getReportRecipients: async (role?: string): Promise<{ success: boolean; data: ReportRecipient[] }> => {
    const response = await api.get('/formal-reports/recipients', {
      params: role ? { role } : {}
    });
    return response.data;
  },

  // Download report as PDF
  downloadReport: async (reportId: string): Promise<void> => {
    const response = await api.get(`/formal-reports/download/${reportId}`, {
      responseType: 'blob'
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `financial-report-${reportId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  // Get view URL for report with auth token for new tab viewing
  getReportViewUrl: (reportId: string): string => {
    const token = localStorage.getItem('token');
    const baseUrl = `${api.defaults.baseURL}/formal-reports/view/${reportId}`;
    return token ? `${baseUrl}?token=${encodeURIComponent(token)}` : baseUrl;
  },
};