"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fieldController_1 = require("../controllers/fieldController");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const router = (0, express_1.Router)();
const fieldController = new fieldController_1.FieldController();
router.post('/', auth_1.authenticate, (0, auth_1.authorize)('field_officer', 'manager', 'farmer'), (0, validation_1.validate)('createField'), fieldController.createField);
router.get('/:id', auth_1.authenticate, (0, validation_1.validateObjectId)('id'), fieldController.getFieldById);
router.get('/farmer/:farmerId', auth_1.authenticate, (0, validation_1.validateObjectId)('farmerId'), fieldController.getFieldsByFarmerId);
router.get('/', auth_1.authenticate, fieldController.getAllFields);
router.put('/:id', auth_1.authenticate, (0, auth_1.authorize)('field_officer', 'manager', 'farmer'), (0, validation_1.validateObjectId)('id'), (0, validation_1.validate)('updateField'), fieldController.updateField);
router.delete('/:id', auth_1.authenticate, (0, auth_1.authorize)('field_officer', 'manager'), (0, validation_1.validateObjectId)('id'), fieldController.deleteField);
exports.default = router;
//# sourceMappingURL=fieldRoutes.js.map