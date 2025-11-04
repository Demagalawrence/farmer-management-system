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
        const newFarmer = {
            ...farmer,
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