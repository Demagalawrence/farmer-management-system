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
        const db = (0, db_1.getDb)();
        let farmerObjectId;
        if (typeof field.farmer_id === 'number') {
            const farmer = await db.collection('farmers').findOne({ external_id: field.farmer_id });
            if (!farmer || !farmer._id) {
                throw new Error('Farmer with the provided external ID was not found');
            }
            farmerObjectId = new mongodb_1.ObjectId(farmer._id);
        }
        else if (typeof field.farmer_id === 'string') {
            if (/^\d+$/.test(field.farmer_id)) {
                const extId = parseInt(field.farmer_id, 10);
                const farmer = await db.collection('farmers').findOne({ external_id: extId });
                if (!farmer || !farmer._id) {
                    throw new Error('Farmer with the provided external ID was not found');
                }
                farmerObjectId = new mongodb_1.ObjectId(farmer._id);
            }
            else {
                farmerObjectId = new mongodb_1.ObjectId(field.farmer_id);
            }
        }
        else if (field.farmer_id instanceof mongodb_1.ObjectId) {
            farmerObjectId = field.farmer_id;
        }
        else {
            throw new Error('Invalid farmer_id type');
        }
        let externalCode = field.external_code;
        if (!externalCode) {
            const last = await this.collection
                .find({ external_code: { $exists: true } })
                .sort({ external_code: -1 })
                .limit(1)
                .toArray();
            let nextSeq = 1;
            if (last.length && last[0].external_code) {
                const match = last[0].external_code.match(/^F-(\d{4})$/);
                if (match) {
                    nextSeq = parseInt(match[1], 10) + 1;
                }
            }
            externalCode = `F-${String(nextSeq).padStart(4, '0')}`;
        }
        const newField = {
            ...field,
            farmer_id: farmerObjectId,
            external_code: externalCode,
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