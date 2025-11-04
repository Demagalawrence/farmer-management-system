import type { Field } from '../../../backend/src/models/Field';
import api from './api';

export const fieldService = {
  // Create a new field
  createField: async (fieldData: Omit<Field, '_id' | 'created_at'>) => {
    const response = await api.post('/fields', fieldData);
    return response.data;
  },

  // Get field by ID
  getFieldById: async (id: string) => {
    const response = await api.get(`/fields/${id}`);
    return response.data;
  },

  // Get fields by farmer ID
  getFieldsByFarmerId: async (farmerId: string) => {
    const response = await api.get(`/fields/farmer/${farmerId}`);
    return response.data;
  },

  // Get all fields
  getAllFields: async () => {
    const response = await api.get('/fields');
    return response.data;
  },

  // Update field
  updateField: async (id: string, fieldData: Partial<Field>) => {
    const response = await api.put(`/fields/${id}`, fieldData);
    return response.data;
  },

  // Delete field
  deleteField: async (id: string) => {
    const response = await api.delete(`/fields/${id}`);
    return response.data;
  },
};