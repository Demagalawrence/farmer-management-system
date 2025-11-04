"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HarvestService = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("../config/db");
class HarvestService {
    constructor() {
        this.collection = (0, db_1.getDb)().collection('harvests');
    }
    async create(harvest) {
        const newHarvest = {
            ...harvest,
            harvest_date: harvest.harvest_date || new Date()
        };
        const result = await this.collection.insertOne(newHarvest);
        return { _id: result.insertedId, ...newHarvest };
    }
    async findById(id) {
        const objectId = typeof id === 'string' ? new mongodb_1.ObjectId(id) : id;
        return await this.collection.findOne({ _id: objectId });
    }
    async findByFarmerId(farmerId) {
        const objectId = typeof farmerId === 'string' ? new mongodb_1.ObjectId(farmerId) : farmerId;
        return await this.collection.find({ farmer_id: objectId }).toArray();
    }
    async findByFieldId(fieldId) {
        const objectId = typeof fieldId === 'string' ? new mongodb_1.ObjectId(fieldId) : fieldId;
        return await this.collection.find({ field_id: objectId }).toArray();
    }
    async findAll() {
        return await this.collection.find().toArray();
    }
    async update(id, harvest) {
        const objectId = typeof id === 'string' ? new mongodb_1.ObjectId(id) : id;
        const result = await this.collection.findOneAndUpdate({ _id: objectId }, { $set: harvest }, { returnDocument: 'after' });
        return result;
    }
    async delete(id) {
        const objectId = typeof id === 'string' ? new mongodb_1.ObjectId(id) : id;
        const result = await this.collection.deleteOne({ _id: objectId });
        return result.deletedCount === 1;
    }
}
exports.HarvestService = HarvestService;
//# sourceMappingURL=harvestService.js.map