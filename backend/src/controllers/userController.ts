import { Request, Response } from 'express';
import { UserService } from '../services/userService';

// We'll create the service instance when needed to avoid initialization issues
let userService: UserService;

const getUserService = (): UserService => {
  if (!userService) {
    userService = new UserService();
  }
  return userService;
};

export class UserController {
  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const service = getUserService();
      const user = await service.create(req.body);
      res.status(201).json({ success: true, data: user });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const service = getUserService();
      const { id } = req.params;
      const user = await service.findById(id);
      
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }
      
      res.status(200).json({ success: true, data: user });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getUserByEmail(req: Request, res: Response): Promise<void> {
    try {
      const service = getUserService();
      const { email } = req.params;
      const user = await service.findByEmail(email);
      
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }
      
      res.status(200).json({ success: true, data: user });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const service = getUserService();
      const users = await service.findAll();
      res.status(200).json({ success: true, data: users });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const service = getUserService();
      const { id } = req.params;
      const user = await service.update(id, req.body);
      
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }
      
      res.status(200).json({ success: true, data: user });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const service = getUserService();
      const { id } = req.params;
      const result = await service.delete(id);
      
      if (!result) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }
      
      res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}