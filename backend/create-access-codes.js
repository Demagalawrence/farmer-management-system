// Script to create access codes in MongoDB
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const dbName = 'fmis';

async function createAccessCodes() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(dbName);
    const accessCodes = db.collection('access_codes');
    
    // Check existing codes
    const existing = await accessCodes.find().toArray();
    console.log('\nExisting access codes:', existing.length);
    
    // Clear old codes
    await accessCodes.deleteMany({});
    console.log('Cleared old access codes');
    
    // Create new access codes
    const codes = [
      {
        role: 'field_officer',
        code: 'FIELD2024',
        status: 'active',
        created_at: new Date(),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        created_by: 'system',
        used_count: 0
      },
      {
        role: 'finance',
        code: 'FINANCE2024',
        status: 'active',
        created_at: new Date(),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        created_by: 'system',
        used_count: 0
      }
    ];
    
    await accessCodes.insertMany(codes);
    
    console.log('\n✅ Access codes created:');
    console.log('Field Officer: FIELD2024');
    console.log('Finance Manager: FINANCE2024');
    console.log('Manager: admin123 (static admin secret)');
    console.log('\nExpires in 30 days');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

createAccessCodes();
