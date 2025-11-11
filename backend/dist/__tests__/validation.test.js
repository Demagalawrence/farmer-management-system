"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validation_1 = require("../middleware/validation");
describe('Validation Schemas', () => {
    describe('Register Schema', () => {
        it('should validate correct registration data', () => {
            const data = {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'Test@1234',
                role: 'farmer',
            };
            const { error, value } = validation_1.schemas.register.validate(data);
            expect(error).toBeUndefined();
            expect(value).toEqual(data);
        });
        it('should reject weak password', () => {
            const data = {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'weak',
                role: 'farmer',
            };
            const { error } = validation_1.schemas.register.validate(data);
            expect(error).toBeDefined();
        });
        it('should reject invalid email', () => {
            const data = {
                name: 'John Doe',
                email: 'invalid-email',
                password: 'Test@1234',
                role: 'farmer',
            };
            const { error } = validation_1.schemas.register.validate(data);
            expect(error).toBeDefined();
        });
        it('should reject short name', () => {
            const data = {
                name: 'J',
                email: 'john@example.com',
                password: 'Test@1234',
                role: 'farmer',
            };
            const { error } = validation_1.schemas.register.validate(data);
            expect(error).toBeDefined();
        });
    });
    describe('Farmer Schema', () => {
        it('should validate correct farmer data', () => {
            const data = {
                user_id: '507f1f77bcf86cd799439011',
                phone: '1234567890',
                address: '123 Farm Road, Rural Area',
                farm_size: 50.5,
                status: 'active',
            };
            const { error, value } = validation_1.schemas.createFarmer.validate(data);
            expect(error).toBeUndefined();
            expect(value.status).toBe('active');
        });
        it('should reject invalid phone number', () => {
            const data = {
                user_id: '507f1f77bcf86cd799439011',
                phone: '123',
                address: '123 Farm Road, Rural Area',
                farm_size: 50.5,
            };
            const { error } = validation_1.schemas.createFarmer.validate(data);
            expect(error).toBeDefined();
        });
        it('should reject negative farm size', () => {
            const data = {
                user_id: '507f1f77bcf86cd799439011',
                phone: '1234567890',
                address: '123 Farm Road, Rural Area',
                farm_size: -10,
            };
            const { error } = validation_1.schemas.createFarmer.validate(data);
            expect(error).toBeDefined();
        });
    });
    describe('Field Schema', () => {
        it('should validate correct field data', () => {
            const plantingDate = new Date();
            const harvestDate = new Date(plantingDate.getTime() + 90 * 24 * 60 * 60 * 1000);
            const data = {
                farmer_id: '507f1f77bcf86cd799439011',
                field_name: 'North Field',
                crop_type: 'Wheat',
                area: 10.5,
                planting_date: plantingDate.toISOString(),
                expected_harvest_date: harvestDate.toISOString(),
                health_status: 'good',
                crop_stage: 'planted',
            };
            const { error } = validation_1.schemas.createField.validate(data);
            expect(error).toBeUndefined();
        });
        it('should reject harvest date before planting date', () => {
            const harvestDate = new Date();
            const plantingDate = new Date(harvestDate.getTime() + 90 * 24 * 60 * 60 * 1000);
            const data = {
                farmer_id: '507f1f77bcf86cd799439011',
                field_name: 'North Field',
                crop_type: 'Wheat',
                area: 10.5,
                planting_date: plantingDate.toISOString(),
                expected_harvest_date: harvestDate.toISOString(),
            };
            const { error } = validation_1.schemas.createField.validate(data);
            expect(error).toBeDefined();
        });
    });
    describe('Payment Schema', () => {
        it('should validate correct payment data', () => {
            const data = {
                farmer_id: '507f1f77bcf86cd799439011',
                harvest_id: '507f1f77bcf86cd799439012',
                amount: 1000,
                payment_method: 'bank_transfer',
                status: 'pending',
            };
            const { error } = validation_1.schemas.createPayment.validate(data);
            expect(error).toBeUndefined();
        });
        it('should reject negative amount', () => {
            const data = {
                farmer_id: '507f1f77bcf86cd799439011',
                harvest_id: '507f1f77bcf86cd799439012',
                amount: -100,
                payment_method: 'bank_transfer',
            };
            const { error } = validation_1.schemas.createPayment.validate(data);
            expect(error).toBeDefined();
        });
        it('should reject invalid payment method', () => {
            const data = {
                farmer_id: '507f1f77bcf86cd799439011',
                harvest_id: '507f1f77bcf86cd799439012',
                amount: 1000,
                payment_method: 'invalid_method',
            };
            const { error } = validation_1.schemas.createPayment.validate(data);
            expect(error).toBeDefined();
        });
    });
});
//# sourceMappingURL=validation.test.js.map