"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateObjectId = exports.validate = exports.schemas = void 0;
const joi_1 = __importDefault(require("joi"));
const errors_1 = require("../utils/errors");
exports.schemas = {
    register: joi_1.default.object({
        name: joi_1.default.string().min(2).max(100).required(),
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().min(8).max(100).required()
            .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
            .message('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
        role: joi_1.default.string().valid('field_officer', 'finance', 'manager', 'farmer').required(),
        accessCode: joi_1.default.string().optional().allow(''),
    }),
    createPaymentRequest: joi_1.default.object({
        farmer_id: joi_1.default.alternatives().try(joi_1.default.string().pattern(/^[0-9a-fA-F]{24}$/), joi_1.default.string().pattern(/^\d+$/), joi_1.default.number().integer().positive()).required(),
        amount: joi_1.default.number().positive().required(),
        purpose: joi_1.default.string().min(2).max(200).optional(),
        category: joi_1.default.string().valid('seeds', 'fertilizer', 'labor', 'equipment', 'utilities', 'maintenance', 'transport', 'other').optional(),
    }),
    login: joi_1.default.object({
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().required(),
    }),
    createFarmer: joi_1.default.object({
        external_id: joi_1.default.number().integer().positive().optional(),
        user_id: joi_1.default.string().optional(),
        name: joi_1.default.string().min(2).max(100).required(),
        email: joi_1.default.string().email().optional(),
        phone: joi_1.default.string().pattern(/^[0-9]{10,15}$/).optional(),
        contact: joi_1.default.string().optional(),
        address: joi_1.default.string().min(5).max(500).optional(),
        farm_size: joi_1.default.number().positive().optional(),
        coordinates: joi_1.default.object({
            lat: joi_1.default.number().min(-90).max(90).required(),
            lng: joi_1.default.number().min(-180).max(180).required()
        }).optional(),
        status: joi_1.default.string().valid('active', 'inactive', 'pending').default('active'),
    }),
    updateFarmer: joi_1.default.object({
        external_id: joi_1.default.number().integer().positive().optional(),
        phone: joi_1.default.string().pattern(/^[0-9]{10,15}$/).optional(),
        address: joi_1.default.string().min(5).max(500).optional(),
        farm_size: joi_1.default.number().positive().optional(),
        coordinates: joi_1.default.object({
            lat: joi_1.default.number().min(-90).max(90).required(),
            lng: joi_1.default.number().min(-180).max(180).required()
        }).optional(),
        status: joi_1.default.string().valid('active', 'inactive', 'pending').optional(),
    }).min(1),
    createField: joi_1.default.object({
        farmer_id: joi_1.default.alternatives().try(joi_1.default.string().pattern(/^[0-9a-fA-F]{24}$/), joi_1.default.string().pattern(/^\d+$/), joi_1.default.number().integer().positive()).required(),
        location: joi_1.default.string().min(2).max(200).required(),
        size_hectares: joi_1.default.number().positive().required(),
        crop_stage: joi_1.default.string().valid('planting', 'growing', 'mature', 'harvest_ready').optional(),
        health_status: joi_1.default.string().valid('healthy', 'needs_attention', 'critical').optional(),
        field_name: joi_1.default.string().min(2).max(100).optional(),
        crop_type: joi_1.default.string().min(2).max(100).optional(),
        area: joi_1.default.number().positive().optional(),
        planting_date: joi_1.default.date().iso().optional(),
        expected_harvest_date: joi_1.default.date().iso().optional(),
    }),
    updateField: joi_1.default.object({
        field_name: joi_1.default.string().min(2).max(100).optional(),
        crop_type: joi_1.default.string().min(2).max(100).optional(),
        area: joi_1.default.number().positive().optional(),
        planting_date: joi_1.default.date().iso().optional(),
        expected_harvest_date: joi_1.default.date().iso().optional(),
        health_status: joi_1.default.string().valid('excellent', 'good', 'fair', 'poor').optional(),
        crop_stage: joi_1.default.string().valid('planted', 'growing', 'flowering', 'mature', 'harvested').optional(),
    }).min(1),
    createHarvest: joi_1.default.object({
        farmer_id: joi_1.default.alternatives().try(joi_1.default.string().pattern(/^[0-9a-fA-F]{24}$/), joi_1.default.string().pattern(/^\d+$/), joi_1.default.number().integer().positive()).required(),
        field_id: joi_1.default.alternatives().try(joi_1.default.string().pattern(/^[0-9a-fA-F]{24}$/), joi_1.default.string().pattern(/^F-\d{4}$/), joi_1.default.number().integer().positive()).required(),
        quantity_tons: joi_1.default.number().positive().required(),
        quality_grade: joi_1.default.string().valid('A', 'B', 'C').optional(),
        harvest_date: joi_1.default.date().iso().optional(),
        crop_type: joi_1.default.string().min(2).max(100).optional(),
        price_per_unit: joi_1.default.number().positive().optional(),
    }),
    updateHarvest: joi_1.default.object({
        crop_type: joi_1.default.string().min(2).max(100).optional(),
        quantity_tons: joi_1.default.number().positive().optional(),
        quality_grade: joi_1.default.string().valid('A', 'B', 'C').optional(),
        harvest_date: joi_1.default.date().iso().optional(),
        price_per_unit: joi_1.default.number().positive().optional(),
    }).min(1),
    createPayment: joi_1.default.object({
        farmer_id: joi_1.default.alternatives().try(joi_1.default.string().pattern(/^[0-9a-fA-F]{24}$/), joi_1.default.number().integer().positive()).required(),
        harvest_id: joi_1.default.alternatives().try(joi_1.default.string().pattern(/^[0-9a-fA-F]{24}$/), joi_1.default.number().integer().positive()).required(),
        amount: joi_1.default.number().positive().required(),
        category: joi_1.default.string().valid('seeds', 'fertilizer', 'labor', 'equipment', 'utilities', 'maintenance', 'transport', 'other').optional(),
        payment_method: joi_1.default.string().valid('cash', 'bank_transfer', 'mobile_money', 'check').required(),
        status: joi_1.default.string().valid('pending', 'completed', 'failed').default('pending'),
    }),
    updatePayment: joi_1.default.object({
        amount: joi_1.default.number().positive().optional(),
        category: joi_1.default.string().valid('seeds', 'fertilizer', 'labor', 'equipment', 'utilities', 'maintenance', 'transport', 'other').optional(),
        payment_method: joi_1.default.string().valid('cash', 'bank_transfer', 'mobile_money', 'check').optional(),
        status: joi_1.default.string().valid('pending', 'approved', 'rejected', 'paid', 'completed', 'failed').optional(),
        payment_date: joi_1.default.date().iso().optional(),
    }).min(1),
    generateReport: joi_1.default.object({
        type: joi_1.default.string().valid('harvest_summary', 'payment_report', 'performance').required(),
        generated_by: joi_1.default.alternatives().try(joi_1.default.string().pattern(/^[0-9a-fA-F]{24}$/), joi_1.default.any()).optional(),
        date_range_start: joi_1.default.date().iso().required(),
        date_range_end: joi_1.default.date().iso().min(joi_1.default.ref('date_range_start')).required(),
        data: joi_1.default.object().required(),
    }),
    createBudget: joi_1.default.object({
        period: joi_1.default.string().min(4).max(10).required(),
        category: joi_1.default.string().valid('seeds', 'fertilizer', 'labor', 'equipment', 'utilities', 'maintenance', 'transport', 'other').required(),
        allocated: joi_1.default.number().positive().required(),
        notes: joi_1.default.string().max(500).optional(),
    }),
    updateBudget: joi_1.default.object({
        allocated: joi_1.default.number().positive().optional(),
        notes: joi_1.default.string().max(500).optional(),
    }).min(1),
};
const validate = (schemaName) => {
    return (req, res, next) => {
        const schema = exports.schemas[schemaName];
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true,
        });
        if (error) {
            const errorMessage = error.details
                .map((detail) => detail.message)
                .join(', ');
            throw new errors_1.ValidationError(errorMessage);
        }
        req.body = value;
        next();
    };
};
exports.validate = validate;
const validateObjectId = (paramName = 'id') => {
    return (req, res, next) => {
        const id = req.params[paramName];
        if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
            throw new errors_1.ValidationError(`Invalid ${paramName} format`);
        }
        next();
    };
};
exports.validateObjectId = validateObjectId;
//# sourceMappingURL=validation.js.map