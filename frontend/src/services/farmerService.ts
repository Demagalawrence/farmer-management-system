import type { Farmer, FieldInfo } from '../../../backend/src/models/Farmer';
import api from './api';

export const farmerService = {
  // Create a new farmer
  createFarmer: async (farmerData: Omit<Farmer, '_id' | 'registration_date' | 'status' | 'fields'>) => {
    const response = await api.post('/farmers', farmerData);
    return response.data;
  },

  // Get farmer by ID
  getFarmerById: async (id: string) => {
    const response = await api.get(`/farmers/${id}`);
    return response.data;
  },

  // Get farmer by user ID
  getFarmerByUserId: async (userId: string) => {
    const response = await api.get(`/farmers/user/${userId}`);
    return response.data;
  },

  // Get all farmers
  getAllFarmers: async () => {
    const response = await api.get('/farmers');
    return response.data;
  },

  // Update farmer
  updateFarmer: async (id: string, farmerData: Partial<Farmer>) => {
    const response = await api.put(`/farmers/${id}`, farmerData);
    return response.data;
  },

  // Delete farmer
  deleteFarmer: async (id: string) => {
    const response = await api.delete(`/farmers/${id}`);
    return response.data;
  },

  // Add field to farmer
  addFieldToFarmer: async (id: string, fieldData: FieldInfo) => {
    const response = await api.post(`/farmers/${id}/fields`, fieldData);
    return response.data;
  },
};