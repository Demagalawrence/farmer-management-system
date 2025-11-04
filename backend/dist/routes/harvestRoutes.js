"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const harvestController_1 = require("../controllers/harvestController");
const router = (0, express_1.Router)();
const harvestController = new harvestController_1.HarvestController();
router.post('/', harvestController.createHarvest);
router.get('/:id', harvestController.getHarvestById);
router.get('/farmer/:farmerId', harvestController.getHarvestsByFarmerId);
router.get('/field/:fieldId', harvestController.getHarvestsByFieldId);
router.get('/', harvestController.getAllHarvests);
router.put('/:id', harvestController.updateHarvest);
router.delete('/:id', harvestController.deleteHarvest);
exports.default = router;
//# sourceMappingURL=harvestRoutes.js.map