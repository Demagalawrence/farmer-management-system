import { MongoClient, Db } from 'mongodb';
import { connectToMockDatabase, getMockDb } from './mockDb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/fmis';
const dbName = process.env.DB_NAME || 'fmis';

let client: MongoClient;
let db: Db;
let useMockDb = false;

export const connectToDatabase = async (): Promise<Db> => {
  if (db && !useMockDb) {
    return db;
  }

  try {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);
    
    // Create indexes
    await createIndexes(db);
    
    console.log('Connected to MongoDB successfully');
    return db;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    console.log('Falling back to mock database for development...');
    
    // Use mock database as fallback
    useMockDb = true;
    await connectToMockDatabase();
    return getMockDb() as any;
  }
};

export const getDb = (): Db => {
  if (useMockDb) {
    return getMockDb() as any;
  }
  if (!db) {
    throw new Error('Database not initialized. Call connectToDatabase first.');
  }
  return db;
};

export const closeDatabase = async (): Promise<void> => {
  if (client) {
    await client.close();
  }
};

const createIndexes = async (database: Db): Promise<void> => {
  try {
    // Users collection indexes
    await database.collection('users').createIndex({ email: 1 }, { unique: true });
    await database.collection('users').createIndex({ role: 1 });

    // Farmers collection indexes
    await database.collection('farmers').createIndex({ user_id: 1 });
    await database.collection('farmers').createIndex({ status: 1 });
    await database.collection('farmers').createIndex({ external_id: 1 }, { unique: true, sparse: true });

    // Fields collection indexes
    await database.collection('fields').createIndex({ farmer_id: 1 });
    await database.collection('fields').createIndex({ health_status: 1 });
    await database.collection('fields').createIndex({ crop_stage: 1 });
    await database.collection('fields').createIndex({ external_code: 1 }, { unique: true, sparse: true });

    // Harvests collection indexes
    await database.collection('harvests').createIndex({ farmer_id: 1 });
    await database.collection('harvests').createIndex({ field_id: 1 });
    await database.collection('harvests').createIndex({ harvest_date: 1 });

    // Payments collection indexes
    await database.collection('payments').createIndex({ farmer_id: 1 });
    await database.collection('payments').createIndex({ status: 1 });
    // Ensure unique harvest payment per harvest, but allow multiple docs with no harvest_id
    try {
      await database.collection('payments').dropIndex('harvest_id_1');
    } catch (e) {
      // index might not exist yet; ignore
    }
    await database.collection('payments').createIndex(
      { harvest_id: 1 },
      {
        name: 'harvest_id_1',
        unique: true,
        partialFilterExpression: { harvest_id: { $exists: true, $ne: null } },
      }
    );

    // Reports collection indexes
    await database.collection('reports').createIndex({ type: 1 });
    await database.collection('reports').createIndex({ generated_by: 1 });

    // Budgets collection indexes
    await database.collection('budgets').createIndex({ period: 1, category: 1 }, { unique: true });
  } catch (error) {
    console.error('Failed to create indexes:', error);
  }
};