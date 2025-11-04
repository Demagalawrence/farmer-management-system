import type { Payment } from '../../../backend/src/models/Payment';
import api from './api';

export const paymentService = {
  // Field officer payment request (no harvest required)
  requestPayment: async (payload: { farmer_id: string | number; amount: number; purpose?: string; category?: string }) => {
    const response = await api.post('/payments/request', payload);
    return response.data;
  },
  // Create a new payment
  createPayment: async (paymentData: Omit<Payment, '_id' | 'created_at' | 'status'>) => {
    const response = await api.post('/payments', paymentData);
    return response.data;
  },

  // Get payment by ID
  getPaymentById: async (id: string) => {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  },

  // Get payments by farmer ID
  getPaymentsByFarmerId: async (farmerId: string) => {
    const response = await api.get(`/payments/farmer/${farmerId}`);
    return response.data;
  },

  // Get payments by status
  getPaymentsByStatus: async (status: 'pending' | 'approved' | 'paid' | 'rejected') => {
    const response = await api.get(`/payments/status/${status}`);
    return response.data;
  },

  // Get all payments
  getAllPayments: async () => {
    const response = await api.get('/payments');
    return response.data;
  },

  // Update payment
  updatePayment: async (id: string, paymentData: Partial<Payment>) => {
    const response = await api.put(`/payments/${id}`, paymentData);
    return response.data;
  },

  // Delete payment
  deletePayment: async (id: string) => {
    const response = await api.delete(`/payments/${id}`);
    return response.data;
  },

  // Approve payment (helper)
  approvePayment: async (id: string) => {
    const response = await api.put(`/payments/${id}`, { status: 'approved' });
    return response.data;
  },

  // Reject payment (helper)
  rejectPayment: async (id: string) => {
    const response = await api.put(`/payments/${id}`, { status: 'rejected' });
    return response.data;
  },
};