import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { connectToDatabase, getDb } from '../config/db';

dotenv.config();

async function createManagerAccount() {
  try {
    await connectToDatabase();
    const db = getDb();
    
    const usersCollection = db.collection('users');
    
    // Check if manager already exists
    const existingManager = await usersCollection.findOne({ email: 'manager@test.com' });
    
    if (existingManager) {
      console.log('Manager account already exists!');
      console.log('Email: manager@test.com');
      console.log('Password: Password123');
      process.exit(0);
    }
    
    // Create manager account
    const hashedPassword = await bcrypt.hash('Password123', 10);
    
    const managerUser = {
      email: 'manager@test.com',
      password: hashedPassword,
      role: 'manager',
      name: 'System Manager',
      phone: '+1234567890',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await usersCollection.insertOne(managerUser);
    
    console.log('✅ Manager account created successfully!');
    console.log('');
    console.log('Login Credentials:');
    console.log('==================');
    console.log('Email: manager@test.com');
    console.log('Password: Password123');
    console.log('Role: Manager');
    console.log('');
    console.log('You can now log in to the application!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating manager account:', error);
    process.exit(1);
  }
}

createManagerAccount();
