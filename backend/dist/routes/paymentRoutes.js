"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paymentController_1 = require("../controllers/paymentController");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const router = (0, express_1.Router)();
const paymentController = new paymentController_1.PaymentController();
router.post('/request', auth_1.authenticate, (0, auth_1.authorize)('field_officer', 'finance', 'manager'), (0, validation_1.validate)('createPaymentRequest'), paymentController.requestPayment);
router.post('/', auth_1.authenticate, (0, auth_1.authorize)('finance', 'manager'), (0, validation_1.validate)('createPayment'), paymentController.createPayment);
router.get('/:id', auth_1.authenticate, (0, validation_1.validateObjectId)('id'), paymentController.getPaymentById);
router.get('/farmer/:farmerId', auth_1.authenticate, (0, validation_1.validateObjectId)('farmerId'), paymentController.getPaymentsByFarmerId);
router.get('/status/:status', auth_1.authenticate, paymentController.getPaymentsByStatus);
router.get('/', auth_1.authenticate, (0, auth_1.authorize)('finance', 'manager'), paymentController.getAllPayments);
router.put('/:id', auth_1.authenticate, (0, auth_1.authorize)('finance', 'manager'), (0, validation_1.validateObjectId)('id'), (0, validation_1.validate)('updatePayment'), paymentController.updatePayment);
router.delete('/:id', auth_1.authenticate, (0, auth_1.authorize)('manager'), (0, validation_1.validateObjectId)('id'), paymentController.deletePayment);
exports.default = router;
//# sourceMappingURL=paymentRoutes.js.map