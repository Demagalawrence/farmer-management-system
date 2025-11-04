"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const paymentService_1 = require("../services/paymentService");
let paymentService;
const getPaymentService = () => {
    if (!paymentService) {
        paymentService = new paymentService_1.PaymentService();
    }
    return paymentService;
};
class PaymentController {
    async createPayment(req, res) {
        try {
            const service = getPaymentService();
            const payment = await service.create(req.body);
            res.status(201).json({ success: true, data: payment });
        }
        catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
    async getPaymentById(req, res) {
        try {
            const service = getPaymentService();
            const { id } = req.params;
            const payment = await service.findById(id);
            if (!payment) {
                res.status(404).json({ success: false, message: 'Payment not found' });
                return;
            }
            res.status(200).json({ success: true, data: payment });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    async getPaymentsByFarmerId(req, res) {
        try {
            const service = getPaymentService();
            const { farmerId } = req.params;
            const payments = await service.findByFarmerId(farmerId);
            res.status(200).json({ success: true, data: payments });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    async getPaymentsByStatus(req, res) {
        try {
            const service = getPaymentService();
            const { status } = req.params;
            const payments = await service.findByStatus(status);
            res.status(200).json({ success: true, data: payments });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    async getAllPayments(req, res) {
        try {
            const service = getPaymentService();
            const payments = await service.findAll();
            res.status(200).json({ success: true, data: payments });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    async updatePayment(req, res) {
        try {
            const service = getPaymentService();
            const { id } = req.params;
            const payment = await service.update(id, req.body);
            if (!payment) {
                res.status(404).json({ success: false, message: 'Payment not found' });
                return;
            }
            res.status(200).json({ success: true, data: payment });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    async deletePayment(req, res) {
        try {
            const service = getPaymentService();
            const { id } = req.params;
            const result = await service.delete(id);
            if (!result) {
                res.status(404).json({ success: false, message: 'Payment not found' });
                return;
            }
            res.status(200).json({ success: true, message: 'Payment deleted successfully' });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}
exports.PaymentController = PaymentController;
//# sourceMappingURL=paymentController.js.map