interface MockDatabase {
    users: any[];
    farmers: any[];
    fields: any[];
    harvests: any[];
    payments: any[];
    reports: any[];
}
export declare class MockDb {
    static getCollection(collectionName: keyof MockDatabase): {
        find: (query?: any) => {
            toArray: () => Promise<any[]>;
        };
        findOne: (query: any) => Promise<any>;
        insertOne: (doc: any) => Promise<{
            insertedId: string;
        }>;
        updateOne: (query: any, update: any) => Promise<{
            modifiedCount: number;
        }>;
        deleteOne: (query: any) => Promise<{
            deletedCount: number;
        }>;
        createIndex: () => Promise<void>;
    };
}
export declare const connectToMockDatabase: () => Promise<boolean>;
export declare const getMockDb: () => typeof MockDb;
export {};
//# sourceMappingURL=mockDb.d.ts.map