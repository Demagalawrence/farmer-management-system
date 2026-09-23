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
        const anyReport = { ...report };
        if (anyReport.generated_by) {
            if (typeof anyReport.generated_by === 'string') {
                anyReport.generated_by = new mongodb_1.ObjectId(anyReport.generated_by);
            }
        }
        if (anyReport.date_range_start && typeof anyReport.date_range_start === 'string') {
            anyReport.date_range_start = new Date(anyReport.date_range_start);
        }
        if (anyReport.date_range_end && typeof anyReport.date_range_end === 'string') {
            anyReport.date_range_end = new Date(anyReport.date_range_end);
        }
        const newReport = {
            ...anyReport,
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
    async aggregatePayments(start, end, interval = 'month') {
        const db = (0, db_1.getDb)();
        const dateField = { $ifNull: ['$payment_date', '$created_at'] };
        const projectStage = {
            year: { $year: dateField },
            amount: '$amount',
        };
        if (interval !== 'year') {
            projectStage.month = { $month: dateField };
        }
        if (interval === 'day') {
            projectStage.day = { $dayOfMonth: dateField };
        }
        const groupId = { year: '$year' };
        if (interval !== 'year')
            groupId.month = '$month';
        if (interval === 'day')
            groupId.day = '$day';
        const cursor = db.collection('payments').aggregate([
            { $match: { $and: [{ $or: [{ payment_date: { $exists: true } }, { created_at: { $exists: true } }] }, { $expr: { $and: [{ $gte: [dateField, start] }, { $lte: [dateField, end] }] } }] } },
            { $project: projectStage },
            { $group: { _id: groupId, total: { $sum: '$amount' }, count: { $sum: 1 } } },
            { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
        ]);
        const results = await cursor.toArray();
        return results.map((r) => ({
            period: interval === 'year' ? `${r._id.year}` : interval === 'month' ? `${r._id.year}-${String(r._id.month).padStart(2, '0')}` : `${r._id.year}-${String(r._id.month).padStart(2, '0')}-${String(r._id.day).padStart(2, '0')}`,
            total: r.total,
            count: r.count,
        }));
    }
    async aggregateHarvests(start, end, interval = 'month') {
        const db = (0, db_1.getDb)();
        const dateField = '$harvest_date';
        const projectStage = {
            year: { $year: dateField },
            quantity_tons: '$quantity_tons',
        };
        if (interval !== 'year') {
            projectStage.month = { $month: dateField };
        }
        if (interval === 'day') {
            projectStage.day = { $dayOfMonth: dateField };
        }
        const groupId = { year: '$year' };
        if (interval !== 'year')
            groupId.month = '$month';
        if (interval === 'day')
            groupId.day = '$day';
        const cursor = db.collection('harvests').aggregate([
            { $match: { harvest_date: { $gte: start, $lte: end } } },
            { $project: projectStage },
            { $group: { _id: groupId, total: { $sum: '$quantity_tons' }, count: { $sum: 1 } } },
            { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
        ]);
        const results = await cursor.toArray();
        return results.map((r) => ({
            period: interval === 'year' ? `${r._id.year}` : interval === 'month' ? `${r._id.year}-${String(r._id.month).padStart(2, '0')}` : `${r._id.year}-${String(r._id.month).padStart(2, '0')}-${String(r._id.day).padStart(2, '0')}`,
            total: r.total,
            count: r.count,
        }));
    }
}
exports.ReportService = ReportService;
//# sourceMappingURL=reportService.js.map