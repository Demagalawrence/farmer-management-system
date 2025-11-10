import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../utils/errors';

// Validation schemas
export const schemas = {
  // Auth schemas
  register: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(100).required()
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .message('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    role: Joi.string().valid('field_officer', 'finance', 'manager', 'farmer').required(),
  }),

  // Payment request schema (FO submits a simple request)
  createPaymentRequest: Joi.object({
    farmer_id: Joi.alternatives().try(
      Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
      Joi.string().pattern(/^\d+$/),
      Joi.number().integer().positive()
    ).required(),
    amount: Joi.number().positive().required(),
    purpose: Joi.string().min(2).max(200).optional(),
    category: Joi.string().valid('seeds','fertilizer','labor','equipment','utilities','maintenance','transport','other').optional(),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  // Farmer schemas
  createFarmer: Joi.object({
    external_id: Joi.number().integer().positive().optional(),
    user_id: Joi.string().optional(),
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().optional(),
    phone: Joi.string().pattern(/^[0-9]{10,15}$/).optional(),
    contact: Joi.string().optional(),
    address: Joi.string().min(5).max(500).optional(),
    farm_size: Joi.number().positive().optional(),
    coordinates: Joi.object({
      lat: Joi.number().min(-90).max(90).required(),
      lng: Joi.number().min(-180).max(180).required()
    }).optional(),
    status: Joi.string().valid('active', 'inactive', 'pending').default('active'),
  }),

  updateFarmer: Joi.object({
    external_id: Joi.number().integer().positive().optional(),
    phone: Joi.string().pattern(/^[0-9]{10,15}$/).optional(),
    address: Joi.string().min(5).max(500).optional(),
    farm_size: Joi.number().positive().optional(),
    coordinates: Joi.object({
      lat: Joi.number().min(-90).max(90).required(),
      lng: Joi.number().min(-180).max(180).required()
    }).optional(),
    status: Joi.string().valid('active', 'inactive', 'pending').optional(),
  }).min(1),

  // Field schemas (supports current frontend payload)
  createField: Joi.object({
    farmer_id: Joi.alternatives().try(
      Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
      Joi.string().pattern(/^\d+$/),
      Joi.number().integer().positive()
    ).required(),
    // Current frontend fields
    location: Joi.string().min(2).max(200).required(),
    size_hectares: Joi.number().positive().required(),
    crop_stage: Joi.string().valid('planting', 'growing', 'mature', 'harvest_ready').optional(),
    health_status: Joi.string().valid('healthy', 'needs_attention', 'critical').optional(),
    // Backward-compat fields (optional)
    field_name: Joi.string().min(2).max(100).optional(),
    crop_type: Joi.string().min(2).max(100).optional(),
    area: Joi.number().positive().optional(),
    planting_date: Joi.date().iso().optional(),
    expected_harvest_date: Joi.date().iso().optional(),
  }),

  updateField: Joi.object({
    field_name: Joi.string().min(2).max(100).optional(),
    crop_type: Joi.string().min(2).max(100).optional(),
    area: Joi.number().positive().optional(),
    planting_date: Joi.date().iso().optional(),
    expected_harvest_date: Joi.date().iso().optional(),
    health_status: Joi.string().valid('excellent', 'good', 'fair', 'poor').optional(),
    crop_stage: Joi.string().valid('planted', 'growing', 'flowering', 'mature', 'harvested').optional(),
  }).min(1),

  // Harvest schemas (align with model + UI: quantity_tons required; others optional)
  createHarvest: Joi.object({
    farmer_id: Joi.alternatives().try(
      Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
      Joi.string().pattern(/^\d+$/),
      Joi.number().integer().positive()
    ).required(),
    field_id: Joi.alternatives().try(
      Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
      Joi.string().pattern(/^F-\d{4}$/),
      Joi.number().integer().positive()
    ).required(),
    quantity_tons: Joi.number().positive().required(),
    quality_grade: Joi.string().valid('A', 'B', 'C').optional(),
    harvest_date: Joi.date().iso().optional(),
    crop_type: Joi.string().min(2).max(100).optional(),
    price_per_unit: Joi.number().positive().optional(),
  }),

  updateHarvest: Joi.object({
    crop_type: Joi.string().min(2).max(100).optional(),
    quantity_tons: Joi.number().positive().optional(),
    quality_grade: Joi.string().valid('A', 'B', 'C').optional(),
    harvest_date: Joi.date().iso().optional(),
    price_per_unit: Joi.number().positive().optional(),
  }).min(1),

  // Payment schemas
  createPayment: Joi.object({
    farmer_id: Joi.alternatives().try(
      Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
      Joi.number().integer().positive()
    ).required(),
    harvest_id: Joi.alternatives().try(
      Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
      Joi.number().integer().positive()
    ).optional(),
    amount: Joi.number().positive().required(),
    payment_type: Joi.string().valid('advance', 'final', 'other').optional(),
    description: Joi.string().max(500).optional(),
    category: Joi.string().valid('seeds','fertilizer','labor','equipment','utilities','maintenance','transport','other').optional(),
    payment_method: Joi.string().valid('cash', 'bank_transfer', 'mobile_money', 'check').optional(),
    status: Joi.string().valid('pending', 'approved', 'rejected', 'paid', 'completed', 'failed').default('pending'),
    calculation: Joi.object().optional(),
    requested_by: Joi.alternatives().try(
      Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
      Joi.any()
    ).optional(),
    requested_at: Joi.date().iso().optional(),
  }),

  updatePayment: Joi.object({
    amount: Joi.number().positive().optional(),
    category: Joi.string().valid('seeds','fertilizer','labor','equipment','utilities','maintenance','transport','other').optional(),
    payment_method: Joi.string().valid('cash', 'bank_transfer', 'mobile_money', 'check').optional(),
    status: Joi.string().valid('pending', 'approved', 'rejected', 'paid', 'completed', 'failed').optional(),
    payment_date: Joi.date().iso().optional(),
    reference: Joi.string().max(200).optional(),
  }).min(1),

  // Report schemas
  generateReport: Joi.object({
    // Align to backend Report model
    type: Joi.string().valid('harvest_summary', 'payment_report', 'performance').required(),
    generated_by: Joi.alternatives().try(
      Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
      Joi.any() // controller may inject from req.user
    ).optional(),
    date_range_start: Joi.date().iso().required(),
    date_range_end: Joi.date().iso().min(Joi.ref('date_range_start')).required(),
    data: Joi.object().required(),
  }),

  // Finance/Budget schemas
  createBudget: Joi.object({
    period: Joi.string().min(4).max(10).required(),
    category: Joi.string().valid('seeds','fertilizer','labor','equipment','utilities','maintenance','transport','other').required(),
    allocated: Joi.number().positive().required(),
    notes: Joi.string().max(500).optional(),
  }),

  updateBudget: Joi.object({
    allocated: Joi.number().positive().optional(),
    notes: Joi.string().max(500).optional(),
  }).min(1),
};

// Validation middleware factory
export const validate = (schemaName: keyof typeof schemas) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const schema = schemas[schemaName];
    
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(', ');
      
      throw new ValidationError(errorMessage);
    }

    // Replace request body with validated and sanitized data
    req.body = value;
    next();
  };
};

// Validate MongoDB ObjectId
export const validateObjectId = (paramName: string = 'id') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const id = req.params[paramName];
    
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      throw new ValidationError(`Invalid ${paramName} format`);
    }
    
    next();
  };
};
