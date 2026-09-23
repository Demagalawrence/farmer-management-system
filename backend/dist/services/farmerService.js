"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FarmerService = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("../config/db");
class FarmerService {
    constructor() {
        this.collection = (0, db_1.getDb)().collection('farmers');
    }
    async create(farmer) {
        let nextExternalId = farmer.external_id;
        if (nextExternalId != null) {
            const exists = await this.collection.findOne({ external_id: nextExternalId });
            if (exists) {
                throw new Error(`external_id ${nextExternalId} is already in use`);
            }
        }
        else {
            const last = await this.collection
                .find({ external_id: { $exists: true } })
                .sort({ external_id: -1 })
                .limit(1)
                .toArray();
            nextExternalId = last.length ? (last[0].external_id || 0) + 1 : 1;
        }
        const newFarmer = {
            ...farmer,
            external_id: nextExternalId,
            registration_date: farmer.registration_date || new Date(),
            status: farmer.status || 'active',
            fields: farmer.fields || []
        };
        const result = await this.collection.insertOne(newFarmer);
        return { _id: result.insertedId, ...newFarmer };
    }
    async findById(id) {
        const objectId = typeof id === 'string' ? new mongodb_1.ObjectId(id) : id;
        return await this.collection.findOne({ _id: objectId });
    }
    async findAll() {
        return await this.collection.find().toArray();
    }
    async findByUserId(userId) {
        const objectId = typeof userId === 'string' ? new mongodb_1.ObjectId(userId) : userId;
        return await this.collection.findOne({ user_id: objectId });
    }
    async update(id, farmer) {
        const objectId = typeof id === 'string' ? new mongodb_1.ObjectId(id) : id;
        const result = await this.collection.findOneAndUpdate({ _id: objectId }, { $set: farmer }, { returnDocument: 'after' });
        return result;
    }
    async delete(id) {
        const objectId = typeof id === 'string' ? new mongodb_1.ObjectId(id) : id;
        const result = await this.collection.deleteOne({ _id: objectId });
        return result.deletedCount === 1;
    }
    async addField(farmerId, field) {
        const objectId = typeof farmerId === 'string' ? new mongodb_1.ObjectId(farmerId) : farmerId;
        const result = await this.collection.findOneAndUpdate({ _id: objectId }, { $push: { fields: field } }, { returnDocument: 'after' });
        return result;
    }
}
exports.FarmerService = FarmerService;
//# sourceMappingURL=farmerService.js.map