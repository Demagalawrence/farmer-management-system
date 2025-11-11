"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("../config/db");
class SearchService {
    constructor() {
        this.db = (0, db_1.getDb)();
    }
    async searchByObjectId(id) {
        const objectId = typeof id === 'string' ? new mongodb_1.ObjectId(id) : id;
        const users = await this.db.collection('users')
            .find({ _id: objectId })
            .toArray();
        const farmers = await this.db.collection('farmers')
            .find({ $or: [{ _id: objectId }, { user_id: objectId }] })
            .toArray();
        const fields = await this.db.collection('fields')
            .find({ $or: [{ _id: objectId }, { farmer_id: objectId }] })
            .toArray();
        const harvests = await this.db.collection('harvests')
            .find({ $or: [{ _id: objectId }, { field_id: objectId }, { farmer_id: objectId }] })
            .toArray();
        const payments = await this.db.collection('payments')
            .find({ $or: [{ _id: objectId }, { farmer_id: objectId }, { harvest_id: objectId }, { processed_by: objectId }] })
            .toArray();
        const reports = await this.db.collection('reports')
            .find({ $or: [{ _id: objectId }, { generated_by: objectId }] })
            .toArray();
        return { users, farmers, fields, harvests, payments, reports };
    }
}
exports.SearchService = SearchService;
//# sourceMappingURL=searchService.js.map