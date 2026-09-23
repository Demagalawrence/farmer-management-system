// Script to create test users in MongoDB
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

const uri = 'mongodb://localhost:27017';
const dbName = 'fmis';

async function createTestUsers() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(dbName);
    const users = db.collection('users');
    
    // Check existing users
    const existingUsers = await users.find().toArray();
    console.log('\nExisting users:', existingUsers.length);
    existingUsers.forEach(u => console.log(`  - ${u.email} (${u.role})`));
    
    // Create test users if they don't exist
    const testUsers = [
      {
        name: 'Test Manager',
        email: 'manager@test.com',
        password: 'Password123',
        role: 'manager'
      },
      {
        name: 'Test Field Officer',
        email: 'officer@test.com',
        password: 'Password123',
        role: 'field_officer'
      },
      {
        name: 'Test Farmer',
        email: 'farmer@test.com',
        password: 'Password123',
        role: 'farmer'
      }
    ];
    
    for (const user of testUsers) {
      const existing = await users.findOne({ email: user.email });
      
      if (!existing) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await users.insertOne({
          name: user.name,
          email: user.email,
          password_hash: hashedPassword,
          role: user.role,
          status: 'active',
          created_at: new Date(),
          updated_at: new Date()
        });
        console.log(`✅ Created user: ${user.email} / ${user.password}`);
      } else {
        console.log(`ℹ️  User already exists: ${user.email}`);
      }
    }
    
    console.log('\n📋 Test Credentials:');
    console.log('Manager: manager@test.com / Password123');
    console.log('Field Officer: officer@test.com / Password123');
    console.log('Farmer: farmer@test.com / Password123');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

createTestUsers();
