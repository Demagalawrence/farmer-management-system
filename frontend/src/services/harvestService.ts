import type { Harvest } from '../../../backend/src/models/Harvest';
import api from './api';

export const harvestService = {
  // Create a new harvest
  createHarvest: async (harvestData: Omit<Harvest, '_id' | 'harvest_date'>) => {
    const response = await api.post('/harvests', harvestData);
    return response.data;
  },

  // Get harvest by ID
  getHarvestById: async (id: string) => {
    const response = await api.get(`/harvests/${id}`);
    return response.data;
  },

  // Get harvests by farmer ID
  getHarvestsByFarmerId: async (farmerId: string) => {
    const response = await api.get(`/harvests/farmer/${farmerId}`);
    return response.data;
  },

  // Get harvests by field ID
  getHarvestsByFieldId: async (fieldId: string) => {
    const response = await api.get(`/harvests/field/${fieldId}`);
    return response.data;
  },

  // Get all harvests
  getAllHarvests: async () => {
    const response = await api.get('/harvests');
    return response.data;
  },

  // Update harvest
  updateHarvest: async (id: string, harvestData: Partial<Harvest>) => {
    const response = await api.put(`/harvests/${id}`, harvestData);
    return response.data;
  },

  // Delete harvest
  deleteHarvest: async (id: string) => {
    const response = await api.delete(`/harvests/${id}`);
    return response.data;
  },
};