"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const searchController_1 = require("../controllers/searchController");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const router = (0, express_1.Router)();
const searchController = new searchController_1.SearchController();
router.get('/:id', auth_1.authenticate, (0, validation_1.validateObjectId)('id'), searchController.searchById);
exports.default = router;
//# sourceMappingURL=searchRoutes.js.map