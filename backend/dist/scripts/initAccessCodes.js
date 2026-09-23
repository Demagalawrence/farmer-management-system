"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../config/db");
const seedAccessCodes_1 = require("../utils/seedAccessCodes");
async function main() {
    try {
        console.log('🔄 Connecting to database...');
        await (0, db_1.connectToDatabase)();
        console.log('✅ Connected to database\n');
        console.log('🔄 Seeding initial access codes...\n');
        await (0, seedAccessCodes_1.seedInitialAccessCodes)();
        console.log('\n✅ Initialization complete!');
        console.log('\nYou can now register accounts with these codes:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('Manager:          admin123');
        console.log('Field Officer:    INITIAL_FO_2024');
        console.log('Finance Manager:  INITIAL_FIN_2024');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}
main();
//# sourceMappingURL=initAccessCodes.js.map