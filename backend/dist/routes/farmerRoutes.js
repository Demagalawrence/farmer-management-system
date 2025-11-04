"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const farmerController_1 = require("../controllers/farmerController");
const router = (0, express_1.Router)();
const farmerController = new farmerController_1.FarmerController();
router.post('/', farmerController.createFarmer);
router.get('/:id', farmerController.getFarmerById);
router.get('/user/:userId', farmerController.getFarmerByUserId);
router.get('/', farmerController.getAllFarmers);
router.put('/:id', farmerController.updateFarmer);
router.delete('/:id', farmerController.deleteFarmer);
router.post('/:id/fields', farmerController.addFieldToFarmer);
exports.default = router;
//# sourceMappingURL=farmerRoutes.js.map