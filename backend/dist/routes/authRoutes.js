"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
const authController = new authController_1.AuthController();
router.post('/login', authController.login);
router.post('/register', authController.register);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map