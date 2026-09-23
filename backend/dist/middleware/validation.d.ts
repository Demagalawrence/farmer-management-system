import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
export declare const schemas: {
    register: Joi.ObjectSchema<any>;
    createPaymentRequest: Joi.ObjectSchema<any>;
    login: Joi.ObjectSchema<any>;
    createFarmer: Joi.ObjectSchema<any>;
    updateFarmer: Joi.ObjectSchema<any>;
    createField: Joi.ObjectSchema<any>;
    updateField: Joi.ObjectSchema<any>;
    createHarvest: Joi.ObjectSchema<any>;
    updateHarvest: Joi.ObjectSchema<any>;
    createPayment: Joi.ObjectSchema<any>;
    updatePayment: Joi.ObjectSchema<any>;
    generateReport: Joi.ObjectSchema<any>;
    createBudget: Joi.ObjectSchema<any>;
    updateBudget: Joi.ObjectSchema<any>;
};
export declare const validate: (schemaName: keyof typeof schemas) => (req: Request, res: Response, next: NextFunction) => void;
export declare const validateObjectId: (paramName?: string) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=validation.d.ts.map