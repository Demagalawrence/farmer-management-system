"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const userService_1 = require("../services/userService");
let userService;
const getUserService = () => {
    if (!userService) {
        userService = new userService_1.UserService();
    }
    return userService;
};
class UserController {
    async createUser(req, res) {
        try {
            const service = getUserService();
            const user = await service.create(req.body);
            res.status(201).json({ success: true, data: user });
        }
        catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
    async getUserById(req, res) {
        try {
            const service = getUserService();
            const { id } = req.params;
            const user = await service.findById(id);
            if (!user) {
                res.status(404).json({ success: false, message: 'User not found' });
                return;
            }
            res.status(200).json({ success: true, data: user });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    async getUserByEmail(req, res) {
        try {
            const service = getUserService();
            const { email } = req.params;
            const user = await service.findByEmail(email);
            if (!user) {
                res.status(404).json({ success: false, message: 'User not found' });
                return;
            }
            res.status(200).json({ success: true, data: user });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    async getAllUsers(req, res) {
        try {
            const service = getUserService();
            const users = await service.findAll();
            res.status(200).json({ success: true, data: users });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    async updateUser(req, res) {
        try {
            const service = getUserService();
            const { id } = req.params;
            const user = await service.update(id, req.body);
            if (!user) {
                res.status(404).json({ success: false, message: 'User not found' });
                return;
            }
            res.status(200).json({ success: true, data: user });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    async deleteUser(req, res) {
        try {
            const service = getUserService();
            const { id } = req.params;
            const result = await service.delete(id);
            if (!result) {
                res.status(404).json({ success: false, message: 'User not found' });
                return;
            }
            res.status(200).json({ success: true, message: 'User deleted successfully' });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}
exports.UserController = UserController;
//# sourceMappingURL=userController.js.map