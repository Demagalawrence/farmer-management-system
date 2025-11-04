"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMockDb = exports.connectToMockDatabase = exports.MockDb = void 0;
let mockDb = {
    users: [
        {
            _id: '1',
            name: 'Admin User',
            email: 'admin@fmis.com',
            role: 'admin',
            created_at: new Date()
        }
    ],
    farmers: [
        {
            _id: '1',
            user_id: '2',
            name: 'John Farmer',
            contact_info: {
                phone: '+1234567890',
                email: 'john@example.com',
                address: '123 Farm Road'
            },
            status: 'active',
            created_at: new Date()
        }
    ],
    fields: [
        {
            _id: '1',
            farmer_id: '1',
            field_name: 'North Field',
            location: 'North Section',
            size_acres: 10.5,
            crop_type: 'Corn',
            crop_stage: 'Growing',
            health_status: 'Healthy',
            created_at: new Date()
        }
    ],
    harvests: [],
    payments: [],
    reports: []
};
class MockDb {
    static getCollection(collectionName) {
        return {
            find: (query = {}) => ({
                toArray: () => Promise.resolve(mockDb[collectionName])
            }),
            findOne: (query) => {
                const items = mockDb[collectionName];
                const item = items.find((item) => {
                    if (query._id)
                        return item._id === query._id;
                    return Object.keys(query).every(key => item[key] === query[key]);
                });
                return Promise.resolve(item || null);
            },
            insertOne: (doc) => {
                const newId = (mockDb[collectionName].length + 1).toString();
                const newDoc = { ...doc, _id: newId, created_at: new Date() };
                mockDb[collectionName].push(newDoc);
                return Promise.resolve({ insertedId: newId });
            },
            updateOne: (query, update) => {
                const items = mockDb[collectionName];
                const index = items.findIndex((item) => {
                    if (query._id)
                        return item._id === query._id;
                    return Object.keys(query).every(key => item[key] === query[key]);
                });
                if (index !== -1) {
                    items[index] = { ...items[index], ...update.$set, updated_at: new Date() };
                    return Promise.resolve({ modifiedCount: 1 });
                }
                return Promise.resolve({ modifiedCount: 0 });
            },
            deleteOne: (query) => {
                const items = mockDb[collectionName];
                const index = items.findIndex((item) => {
                    if (query._id)
                        return item._id === query._id;
                    return Object.keys(query).every(key => item[key] === query[key]);
                });
                if (index !== -1) {
                    items.splice(index, 1);
                    return Promise.resolve({ deletedCount: 1 });
                }
                return Promise.resolve({ deletedCount: 0 });
            },
            createIndex: () => Promise.resolve()
        };
    }
}
exports.MockDb = MockDb;
const connectToMockDatabase = async () => {
    console.log('Using mock database for development');
    return Promise.resolve(true);
};
exports.connectToMockDatabase = connectToMockDatabase;
const getMockDb = () => MockDb;
exports.getMockDb = getMockDb;
//# sourceMappingURL=mockDb.js.map