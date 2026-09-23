"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedInitialAccessCodes = seedInitialAccessCodes;
const db_1 = require("../config/db");
async function seedInitialAccessCodes() {
    try {
        const db = (0, db_1.getDb)();
        const initialCodes = [
            {
                role: 'field_officer',
                code: 'INITIAL_FO_2024',
                status: 'active',
                created_at: new Date(),
                expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                generated_by: 'system'
            },
            {
                role: 'finance',
                code: 'INITIAL_FIN_2024',
                status: 'active',
                created_at: new Date(),
                expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                generated_by: 'system'
            }
        ];
        for (const code of initialCodes) {
            const existing = await db.collection('access_codes').findOne({
                role: code.role,
                generated_by: 'system'
            });
            if (!existing) {
                await db.collection('access_codes').insertOne(code);
                console.log(`✅ Created initial access code for ${code.role}: ${code.code}`);
            }
            else {
                console.log(`⚠️ Initial access code for ${code.role} already exists`);
            }
        }
        console.log('\n📝 Initial Access Codes:');
        console.log('Field Officer: INITIAL_FO_2024');
        console.log('Finance Manager: INITIAL_FIN_2024');
        console.log('Manager: admin123 (from .env)\n');
        return true;
    }
    catch (error) {
        console.error('Error seeding access codes:', error);
        return false;
    }
}
//# sourceMappingURL=seedAccessCodes.js.map