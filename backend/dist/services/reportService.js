"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportService = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("../config/db");
class ReportService {
    constructor() {
        this.collection = (0, db_1.getDb)().collection('reports');
    }
    async create(report) {
        const newReport = {
            ...report,
            created_at: report.created_at || new Date()
        };
        const result = await this.collection.insertOne(newReport);
        return { _id: result.insertedId, ...newReport };
    }
    async findById(id) {
        const objectId = typeof id === 'string' ? new mongodb_1.ObjectId(id) : id;
        return await this.collection.findOne({ _id: objectId });
    }
    async findByType(type) {
        return await this.collection.find({ type }).toArray();
    }
    async findByGeneratedBy(userId) {
        const objectId = typeof userId === 'string' ? new mongodb_1.ObjectId(userId) : userId;
        return await this.collection.find({ generated_by: objectId }).toArray();
    }
    async findAll() {
        return await this.collection.find().toArray();
    }
    async update(id, report) {
        const objectId = typeof id === 'string' ? new mongodb_1.ObjectId(id) : id;
        const result = await this.collection.findOneAndUpdate({ _id: objectId }, { $set: report }, { returnDocument: 'after' });
        return result;
    }
    async delete(id) {
        const objectId = typeof id === 'string' ? new mongodb_1.ObjectId(id) : id;
        const result = await this.collection.deleteOne({ _id: objectId });
        return result.deletedCount === 1;
    }
}
exports.ReportService = ReportService;
//# sourceMappingURL=reportService.js.map