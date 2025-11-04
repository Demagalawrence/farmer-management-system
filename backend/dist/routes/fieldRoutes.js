"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fieldController_1 = require("../controllers/fieldController");
const router = (0, express_1.Router)();
const fieldController = new fieldController_1.FieldController();
router.post('/', fieldController.createField);
router.get('/:id', fieldController.getFieldById);
router.get('/farmer/:farmerId', fieldController.getFieldsByFarmerId);
router.get('/', fieldController.getAllFields);
router.put('/:id', fieldController.updateField);
router.delete('/:id', fieldController.deleteField);
exports.default = router;
//# sourceMappingURL=fieldRoutes.js.map