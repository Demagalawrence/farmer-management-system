"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("../config/db");
class PaymentService {
    constructor() {
        this.collection = (0, db_1.getDb)().collection('payments');
    }
    async create(payment) {
        const newPayment = {
            ...payment,
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