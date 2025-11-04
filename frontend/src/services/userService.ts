import type { User } from '../../../backend/src/models/User';
import api from './api';

export const userService = {
  // Create a new user
  createUser: async (userData: Omit<User, '_id' | 'created_at'>) => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  // Get user by ID
  getUserById: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Get user by email
  getUserByEmail: async (email: string) => {
    const response = await api.get(`/users/email/${email}`);
    return response.data;
  },

  // Get all users
  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  // Update user
  updateUser: async (id: string, userData: Partial<User>) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  // Delete user
  deleteUser: async (id: string) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};