/**
 * Initialize Access Codes Script
 * Run this to create initial access codes for first-time setup
 * 
 * Usage: npm run seed:codes
 * Or: ts-node src/scripts/initAccessCodes.ts
 */

import { connectToDatabase } from '../config/db';
import { seedInitialAccessCodes } from '../utils/seedAccessCodes';

async function main() {
  try {
    console.log('🔄 Connecting to database...');
    await connectToDatabase();
    console.log('✅ Connected to database\n');

    console.log('🔄 Seeding initial access codes...\n');
    await seedInitialAccessCodes();

    console.log('\n✅ Initialization complete!');
    console.log('\nYou can now register accounts with these codes:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Manager:          admin123');
    console.log('Field Officer:    INITIAL_FO_2024');
    console.log('Finance Manager:  INITIAL_FIN_2024');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
