"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FarmerController = void 0;
const farmerService_1 = require("../services/farmerService");
let farmerService;
const getFarmerService = () => {
    if (!farmerService) {
        farmerService = new farmerService_1.FarmerService();
    }
    return farmerService;
};
class FarmerController {
    async createFarmer(req, res) {
        try {
            const service = getFarmerService();
            const farmer = await service.create(req.body);
            res.status(201).json({ success: true, data: farmer });
        }
        catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
    async getFarmerById(req, res) {
        try {
            const service = getFarmerService();
            const { id } = req.params;
            const farmer = await service.findById(id);
            if (!farmer) {
                res.status(404).json({ success: false, message: 'Farmer not found' });
                return;
            }
            res.status(200).json({ success: true, data: farmer });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    async getFarmerByUserId(req, res) {
        try {
            const service = getFarmerService();
            const { userId } = req.params;
            const farmer = await service.findByUserId(userId);
            if (!farmer) {
                res.status(404).json({ success: false, message: 'Farmer not found' });
                return;
            }
            res.status(200).json({ success: true, data: farmer });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    async getAllFarmers(req, res) {
        try {
            const service = getFarmerService();
            const farmers = await service.findAll();
            res.status(200).json({ success: true, data: farmers });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    async updateFarmer(req, res) {
        try {
            const service = getFarmerService();
            const { id } = req.params;
            const farmer = await service.update(id, req.body);
            if (!farmer) {
                res.status(404).json({ success: false, message: 'Farmer not found' });
                return;
            }
            res.status(200).json({ success: true, data: farmer });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    async deleteFarmer(req, res) {
        try {
            const service = getFarmerService();
            const { id } = req.params;
            const result = await service.delete(id);
            if (!result) {
                res.status(404).json({ success: false, message: 'Farmer not found' });
                return;
            }
            res.status(200).json({ success: true, message: 'Farmer deleted successfully' });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    async addFieldToFarmer(req, res) {
        try {
            const service = getFarmerService();
            const { id } = req.params;
            const field = req.body;
            const farmer = await service.addField(id, field);
            if (!farmer) {
                res.status(404).json({ success: false, message: 'Farmer not found' });
                return;
            }
            res.status(200).json({ success: true, data: farmer });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}
exports.FarmerController = FarmerController;
//# sourceMappingURL=farmerController.js.map