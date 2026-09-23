"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("../config/db");
const emailService_1 = require("./emailService");
class PaymentService {
    constructor() {
        this.collection = (0, db_1.getDb)().collection('payments');
    }
    async create(payment) {
        const db = (0, db_1.getDb)();
        let farmerObjectId;
        const anyPayment = payment;
        if ('harvest_id' in anyPayment) {
            if (anyPayment.harvest_id === null || anyPayment.harvest_id === undefined || anyPayment.harvest_id === '') {
                delete anyPayment.harvest_id;
            }
        }
        if (typeof anyPayment.farmer_id === 'number') {
            const farmer = await db.collection('farmers').findOne({ external_id: anyPayment.farmer_id });
            if (!farmer || !farmer._id) {
                throw new Error('Farmer with the provided external ID was not found');
            }
            farmerObjectId = new mongodb_1.ObjectId(farmer._id);
        }
        else if (typeof anyPayment.farmer_id === 'string') {
            if (/^\d+$/.test(anyPayment.farmer_id)) {
                const extId = parseInt(anyPayment.farmer_id, 10);
                const farmer = await db.collection('farmers').findOne({ external_id: extId });
                if (!farmer || !farmer._id) {
                    throw new Error('Farmer with the provided external ID was not found');
                }
                farmerObjectId = new mongodb_1.ObjectId(farmer._id);
            }
            else {
                farmerObjectId = new mongodb_1.ObjectId(anyPayment.farmer_id);
            }
        }
        else if (anyPayment.farmer_id instanceof mongodb_1.ObjectId) {
            farmerObjectId = anyPayment.farmer_id;
        }
        else {
            throw new Error('Invalid farmer_id type');
        }
        const newPayment = {
            ...payment,
            farmer_id: farmerObjectId,
            created_at: payment.created_at || new Date(),
            status: payment.status || 'pending'
        };
        const result = await this.collection.insertOne(newPayment);
        return { _id: result.insertedId, ...newPayment };
    }
    async findById(id) {
        const objectId = typeof id === 'string' ? new mongodb_1.ObjectId(id) : id;
        return await this.collection.findOne({ _id: objectId });
    }
    async findByFarmerId(farmerId) {
        const objectId = typeof farmerId === 'string' ? new mongodb_1.ObjectId(farmerId) : farmerId;
        return await this.collection.find({ farmer_id: objectId }).toArray();
    }
    async findByStatus(status) {
        return await this.collection.find({ status }).toArray();
    }
    async findAll() {
        return await this.collection.find().toArray();
    }
    async update(id, payment) {
        const objectId = typeof id === 'string' ? new mongodb_1.ObjectId(id) : id;
        const result = await this.collection.findOneAndUpdate({ _id: objectId }, { $set: payment }, { returnDocument: 'after' });
        try {
            if (payment && payment.status === 'approved' && result) {
                const db = (0, db_1.getDb)();
                const farmer = await db.collection('farmers').findOne({ _id: result.farmer_id });
                if (farmer && farmer.email) {
                    const amount = result.amount;
                    const subject = 'Payment Approved';
                    const text = `Hello ${farmer.name || 'Farmer'}, your payment of ${amount} has been approved. You will receive the funds shortly.`;
                    await emailService_1.EmailService.send(farmer.email, subject, text);
                }
            }
        }
        catch (e) {
            console.error('Failed to send approval email:', e);
        }
        try {
            if (payment && payment.status === 'paid' && result) {
                const db = (0, db_1.getDb)();
                const farmer = await db.collection('farmers').findOne({ _id: result.farmer_id });
                if (farmer && farmer.email) {
                    const amount = result.amount;
                    const subject = 'Payment Completed';
                    const text = `Hello ${farmer.name || 'Farmer'}, your payment of ${amount} has been completed and disbursed. Thank you.`;
                    await emailService_1.EmailService.send(farmer.email, subject, text);
                }
            }
        }
        catch (e) {
            console.error('Failed to send paid email:', e);
        }
        try {
            if (payment && payment.status === 'paid' && result) {
                const db = (0, db_1.getDb)();
                await db.collection('notifications').insertOne({
                    type: 'payment_processed',
                    payment_id: objectId,
                    farmer_id: result.farmer_id,
                    amount: result.amount,
                    created_at: new Date(),
                    audience: 'manager',
                    read: false,
                });
            }
        }
        catch (e) {
            console.error('Failed to create notification for payment:', e);
        }
        return result;
    }
    async delete(id) {
        const objectId = typeof id === 'string' ? new mongodb_1.ObjectId(id) : id;
        const result = await this.collection.deleteOne({ _id: objectId });
        return result.deletedCount === 1;
    }
}
exports.PaymentService = PaymentService;
//# sourceMappingURL=paymentService.js.map