import api from './api';

export const financeService = {
  // List manager approval requests (default pending)
  getApprovalRequests: async (status: 'pending' | 'approved' | 'denied' | '' = 'pending') => {
    const query = status ? `?status=${status}` : '';
    const res = await api.get(`/finance/approvals${query}`);
    return res.data;
  },

  // Create a new manager approval request (finance role)
  requestManagerApproval: async (payment_ids: string[], note?: string) => {
    const res = await api.post('/finance/approvals/request', { payment_ids, note });
    return res.data;
  },

  // Manager decision on a request
  decideApproval: async (id: string, decision: 'approved' | 'denied') => {
    const res = await api.post(`/finance/approvals/${id}/decision`, { decision });
    return res.data;
  },
};
