"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeDatabase = exports.getDb = exports.connectToDatabase = void 0;
const mongodb_1 = require("mongodb");
const mockDb_1 = require("./mockDb");
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/fmis';
const dbName = process.env.DB_NAME || 'fmis';
let client;
let db;
let useMockDb = false;
const connectToDatabase = async () => {
    if (db && !useMockDb) {
        return db;
    }
    try {
        client = new mongodb_1.MongoClient(uri);
        await client.connect();
        db = client.db(dbName);
        await createIndexes(db);
        console.log('Connected to MongoDB successfully');
        return db;
    }
    catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        console.log('Falling back to mock database for development...');
        useMockDb = true;
        await (0, mockDb_1.connectToMockDatabase)();
        return (0, mockDb_1.getMockDb)();
    }
};
exports.connectToDatabase = connectToDatabase;
const getDb = () => {
    if (useMockDb) {
        return (0, mockDb_1.getMockDb)();
    }
    if (!db) {
        throw new Error('Database not initialized. Call connectToDatabase first.');
    }
    return db;
};
exports.getDb = getDb;
const closeDatabase = async () => {
    if (client) {
        await client.close();
    }
};
exports.closeDatabase = closeDatabase;
const createIndexes = async (database) => {
    try {
        await database.collection('users').createIndex({ email: 1 }, { unique: true });
        await database.collection('users').createIndex({ role: 1 });
        await database.collection('farmers').createIndex({ user_id: 1 });
        await database.collection('farmers').createIndex({ status: 1 });
        await database.collection('fields').createIndex({ farmer_id: 1 });
        await database.collection('fields').createIndex({ health_status: 1 });
        await database.collection('fields').createIndex({ crop_stage: 1 });
        await database.collection('harvests').createIndex({ farmer_id: 1 });
        await database.collection('harvests').createIndex({ field_id: 1 });
        await database.collection('harvests').createIndex({ harvest_date: 1 });
        await database.collection('payments').createIndex({ farmer_id: 1 });
        await database.collection('payments').createIndex({ status: 1 });
        await database.collection('payments').createIndex({ harvest_id: 1 }, { unique: true });
        await database.collection('reports').createIndex({ type: 1 });
        await database.collection('reports').createIndex({ generated_by: 1 });
    }
    catch (error) {
        console.error('Failed to create indexes:', error);
    }
};
//# sourceMappingURL=db.js.map