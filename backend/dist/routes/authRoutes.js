"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const validation_1 = require("../middleware/validation");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const authController = new authController_1.AuthController();
router.post('/login', (0, validation_1.validate)('login'), authController.login);
router.post('/register', (0, validation_1.validate)('register'), authController.register);
router.get('/profile', auth_1.authenticate, authController.getProfile);
router.post('/change-password', auth_1.authenticate, authController.changePassword);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map