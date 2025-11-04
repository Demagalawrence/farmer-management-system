"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("../config/db");
class UserService {
    constructor() {
        this.collection = (0, db_1.getDb)().collection('users');
    }
    async create(user) {
        const newUser = {
            ...user,
            created_at: new Date()
        };
        const result = await this.collection.insertOne(newUser);
        return { _id: result.insertedId, ...newUser };
    }
    async findById(id) {
        const objectId = typeof id === 'string' ? new mongodb_1.ObjectId(id) : id;
        return await this.collection.findOne({ _id: objectId });
    }
    async findByEmail(email) {
        return await this.collection.findOne({ email });
    }
    async findAll() {
        return await this.collection.find().toArray();
    }
    async update(id, user) {
        const objectId = typeof id === 'string' ? new mongodb_1.ObjectId(id) : id;
        const result = await this.collection.findOneAndUpdate({ _id: objectId }, { $set: user }, { returnDocument: 'after' });
        return result;
    }
    async delete(id) {
        const objectId = typeof id === 'string' ? new mongodb_1.ObjectId(id) : id;
        const result = await this.collection.deleteOne({ _id: objectId });
        return result.deletedCount === 1;
    }
}
exports.UserService = UserService;
//# sourceMappingURL=userService.js.map