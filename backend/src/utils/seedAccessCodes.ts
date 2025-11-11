import { getDb } from '../config/db';

/**
 * Seed initial access codes for first-time setup
 * Run this script if you need to create initial codes before manager account exists
 */
export async function seedInitialAccessCodes() {
  try {
    const db = getDb();
    
    // Create initial access codes for first-time setup
    const initialCodes = [
      {
        role: 'field_officer',
        code: 'INITIAL_FO_2024',
        status: 'active',
        created_at: new Date(),
        expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        generated_by: 'system'
      },
      {
        role: 'finance',
        code: 'INITIAL_FIN_2024',
        status: 'active',
        created_at: new Date(),
        expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        generated_by: 'system'
      }
    ];

    // Insert only if they don't exist
    for (const code of initialCodes) {
      const existing = await db.collection('access_codes').findOne({
        role: code.role,
        generated_by: 'system'
      });

      if (!existing) {
        await db.collection('access_codes').insertOne(code);
        console.log(`✅ Created initial access code for ${code.role}: ${code.code}`);
      } else {
        console.log(`⚠️ Initial access code for ${code.role} already exists`);
      }
    }

    console.log('\n📝 Initial Access Codes:');
    console.log('Field Officer: INITIAL_FO_2024');
    console.log('Finance Manager: INITIAL_FIN_2024');
    console.log('Manager: admin123 (from .env)\n');
    
    return true;
  } catch (error) {
    console.error('Error seeding access codes:', error);
    return false;
  }
}
