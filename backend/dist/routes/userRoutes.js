"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const router = (0, express_1.Router)();
const userController = new userController_1.UserController();
router.post('/', userController.createUser);
router.get('/:id', userController.getUserById);
router.get('/email/:email', userController.getUserByEmail);
router.get('/', userController.getAllUsers);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map