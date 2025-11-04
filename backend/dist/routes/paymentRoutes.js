"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paymentController_1 = require("../controllers/paymentController");
const router = (0, express_1.Router)();
const paymentController = new paymentController_1.PaymentController();
router.post('/', paymentController.createPayment);
router.get('/:id', paymentController.getPaymentById);
router.get('/farmer/:farmerId', paymentController.getPaymentsByFarmerId);
router.get('/status/:status', paymentController.getPaymentsByStatus);
router.get('/', paymentController.getAllPayments);
router.put('/:id', paymentController.updatePayment);
router.delete('/:id', paymentController.deletePayment);
exports.default = router;
//# sourceMappingURL=paymentRoutes.js.map