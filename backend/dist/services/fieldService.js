"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldService = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("../config/db");
class FieldService {
    constructor() {
        this.collection = (0, db_1.getDb)().collection('fields');
    }
    async create(field) {
        const newField = {
            ...field,
            created_at: field.created_at || new Date(),
            crop_stage: field.crop_stage || 'planting',
            health_status: field.health_status || 'healthy'
        };
        const result = await this.collection.insertOne(newField);
        return { _id: result.insertedId, ...newField };
    }
    async findById(id) {
        const objectId = typeof id === 'string' ? new mongodb_1.ObjectId(id) : id;
        return await this.collection.findOne({ _id: objectId });
    }
    async findByFarmerId(farmerId) {
        const objectId = typeof farmerId === 'string' ? new mongodb_1.ObjectId(farmerId) : farmerId;
        return await this.collection.find({ farmer_id: objectId }).toArray();
    }
    async findAll() {
        return await this.collection.find().toArray();
    }
    async update(id, field) {
        const objectId = typeof id === 'string' ? new mongodb_1.ObjectId(id) : id;
        const result = await this.collection.findOneAndUpdate({ _id: objectId }, { $set: field }, { returnDocument: 'after' });
        return result;
    }
    async delete(id) {
        const objectId = typeof id === 'string' ? new mongodb_1.ObjectId(id) : id;
        const result = await this.collection.deleteOne({ _id: objectId });
        return result.deletedCount === 1;
    }
}
exports.FieldService = FieldService;
//# sourceMappingURL=fieldService.js.map