"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HarvestController = void 0;
const harvestService_1 = require("../services/harvestService");
let harvestService;
const getHarvestService = () => {
    if (!harvestService) {
        harvestService = new harvestService_1.HarvestService();
    }
    return harvestService;
};
class HarvestController {
    async createHarvest(req, res) {
        try {
            const service = getHarvestService();
            const harvest = await service.create(req.body);
            res.status(201).json({ success: true, data: harvest });
        }
        catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
    async getHarvestById(req, res) {
        try {
            const service = getHarvestService();
            const { id } = req.params;
            const harvest = await service.findById(id);
            if (!harvest) {
                res.status(404).json({ success: false, message: 'Harvest not found' });
                return;
            }
            res.status(200).json({ success: true, data: harvest });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    async getHarvestsByFarmerId(req, res) {
        try {
            const service = getHarvestService();
            const { farmerId } = req.params;
            const harvests = await service.findByFarmerId(farmerId);
            res.status(200).json({ success: true, data: harvests });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    async getHarvestsByFieldId(req, res) {
        try {
            const service = getHarvestService();
            const { fieldId } = req.params;
            const harvests = await service.findByFieldId(fieldId);
            res.status(200).json({ success: true, data: harvests });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    async getAllHarvests(req, res) {
        try {
            const service = getHarvestService();
            const harvests = await service.findAll();
            res.status(200).json({ success: true, data: harvests });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    async updateHarvest(req, res) {
        try {
            const service = getHarvestService();
            const { id } = req.params;
            const harvest = await service.update(id, req.body);
            if (!harvest) {
                res.status(404).json({ success: false, message: 'Harvest not found' });
                return;
            }
            res.status(200).json({ success: true, data: harvest });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    async deleteHarvest(req, res) {
        try {
            const service = getHarvestService();
            const { id } = req.params;
            const result = await service.delete(id);
            if (!result) {
                res.status(404).json({ success: false, message: 'Harvest not found' });
                return;
            }
            res.status(200).json({ success: true, message: 'Harvest deleted successfully' });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}
exports.HarvestController = HarvestController;
//# sourceMappingURL=harvestController.js.map