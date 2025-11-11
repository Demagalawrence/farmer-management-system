"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const farmerController_1 = require("../controllers/farmerController");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const router = (0, express_1.Router)();
const farmerController = new farmerController_1.FarmerController();
router.post('/', auth_1.authenticate, (0, auth_1.authorize)('field_officer', 'manager'), (0, validation_1.validate)('createFarmer'), farmerController.createFarmer);
router.get('/:id', auth_1.authenticate, (0, validation_1.validateObjectId)('id'), farmerController.getFarmerById);
router.get('/user/:userId', auth_1.authenticate, (0, validation_1.validateObjectId)('userId'), farmerController.getFarmerByUserId);
router.get('/', auth_1.authenticate, farmerController.getAllFarmers);
router.put('/:id', auth_1.authenticate, (0, auth_1.authorize)('field_officer', 'manager'), (0, validation_1.validateObjectId)('id'), (0, validation_1.validate)('updateFarmer'), farmerController.updateFarmer);
router.delete('/:id', auth_1.authenticate, (0, auth_1.authorize)('manager'), (0, validation_1.validateObjectId)('id'), farmerController.deleteFarmer);
router.post('/:id/fields', auth_1.authenticate, (0, auth_1.authorize)('field_officer', 'manager'), (0, validation_1.validateObjectId)('id'), farmerController.addFieldToFarmer);
exports.default = router;
//# sourceMappingURL=farmerRoutes.js.map