"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const harvestController_1 = require("../controllers/harvestController");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const router = (0, express_1.Router)();
const harvestController = new harvestController_1.HarvestController();
router.post('/', auth_1.authenticate, (0, auth_1.authorize)('field_officer', 'manager'), (0, validation_1.validate)('createHarvest'), harvestController.createHarvest);
router.get('/:id', auth_1.authenticate, (0, validation_1.validateObjectId)('id'), harvestController.getHarvestById);
router.get('/farmer/:farmerId', auth_1.authenticate, (0, validation_1.validateObjectId)('farmerId'), harvestController.getHarvestsByFarmerId);
router.get('/field/:fieldId', auth_1.authenticate, (0, validation_1.validateObjectId)('fieldId'), harvestController.getHarvestsByFieldId);
router.get('/', auth_1.authenticate, harvestController.getAllHarvests);
router.put('/:id', auth_1.authenticate, (0, auth_1.authorize)('field_officer', 'manager'), (0, validation_1.validateObjectId)('id'), (0, validation_1.validate)('updateHarvest'), harvestController.updateHarvest);
router.delete('/:id', auth_1.authenticate, (0, auth_1.authorize)('manager'), (0, validation_1.validateObjectId)('id'), harvestController.deleteHarvest);
exports.default = router;
//# sourceMappingURL=harvestRoutes.js.map