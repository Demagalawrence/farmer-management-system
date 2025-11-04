"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldController = void 0;
const fieldService_1 = require("../services/fieldService");
let fieldService;
const getFieldService = () => {
    if (!fieldService) {
        fieldService = new fieldService_1.FieldService();
    }
    return fieldService;
};
class FieldController {
    async createField(req, res) {
        try {
            const service = getFieldService();
            const field = await service.create(req.body);
            res.status(201).json({ success: true, data: field });
        }
        catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
    async getFieldById(req, res) {
        try {
            const service = getFieldService();
            const { id } = req.params;
            const field = await service.findById(id);
            if (!field) {
                res.status(404).json({ success: false, message: 'Field not found' });
                return;
            }
            res.status(200).json({ success: true, data: field });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    async getFieldsByFarmerId(req, res) {
        try {
            const service = getFieldService();
            const { farmerId } = req.params;
            const fields = await service.findByFarmerId(farmerId);
            res.status(200).json({ success: true, data: fields });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    async getAllFields(req, res) {
        try {
            const service = getFieldService();
            const fields = await service.findAll();
            res.status(200).json({ success: true, data: fields });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    async updateField(req, res) {
        try {
            const service = getFieldService();
            const { id } = req.params;
            const field = await service.update(id, req.body);
            if (!field) {
                res.status(404).json({ success: false, message: 'Field not found' });
                return;
            }
            res.status(200).json({ success: true, data: field });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    async deleteField(req, res) {
        try {
            const service = getFieldService();
            const { id } = req.params;
            const result = await service.delete(id);
            if (!result) {
                res.status(404).json({ success: false, message: 'Field not found' });
                return;
            }
            res.status(200).json({ success: true, message: 'Field deleted successfully' });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}
exports.FieldController = FieldController;
//# sourceMappingURL=fieldController.js.map