"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.backupService = exports.BackupService = void 0;
const mongodb_1 = require("mongodb");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const node_cron_1 = __importDefault(require("node-cron"));
const logger_1 = __importDefault(require("./logger"));
const BACKUP_DIR = process.env.BACKUP_DIR || path.join(process.cwd(), 'backups');
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fmis';
const DB_NAME = process.env.DB_NAME || 'fmis';
if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
}
class BackupService {
    constructor() {
        this.client = null;
    }
    async connect() {
        try {
            this.client = new mongodb_1.MongoClient(MONGODB_URI);
            await this.client.connect();
            logger_1.default.info('Connected to MongoDB for backup');
        }
        catch (error) {
            logger_1.default.error('Failed to connect to MongoDB for backup:', error);
            throw error;
        }
    }
    async disconnect() {
        if (this.client) {
            await this.client.close();
            this.client = null;
            logger_1.default.info('Disconnected from MongoDB');
        }
    }
    async createBackup() {
        try {
            if (!this.client) {
                await this.connect();
            }
            const db = this.client.db(DB_NAME);
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const backupFileName = `backup-${timestamp}.json`;
            const backupPath = path.join(BACKUP_DIR, backupFileName);
            const collections = await db.listCollections().toArray();
            const backup = {
                timestamp: new Date().toISOString(),
                database: DB_NAME,
                collections: {},
            };
            for (const collectionInfo of collections) {
                const collectionName = collectionInfo.name;
                const collection = db.collection(collectionName);
                const documents = await collection.find({}).toArray();
                backup.collections[collectionName] = documents;
                logger_1.default.info(`Backed up collection: ${collectionName} (${documents.length} documents)`);
            }
            fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));
            logger_1.default.info(`Backup created successfully: ${backupPath}`);
            this.cleanOldBackups(30);
            return backupPath;
        }
        catch (error) {
            logger_1.default.error('Backup failed:', error);
            throw error;
        }
    }
    async restoreBackup(backupPath) {
        try {
            if (!this.client) {
                await this.connect();
            }
            const db = this.client.db(DB_NAME);
            const backupData = JSON.parse(fs.readFileSync(backupPath, 'utf-8'));
            logger_1.default.info(`Restoring backup from: ${backupPath}`);
            for (const [collectionName, documents] of Object.entries(backupData.collections)) {
                const collection = db.collection(collectionName);
                await collection.deleteMany({});
                if (Array.isArray(documents) && documents.length > 0) {
                    await collection.insertMany(documents);
                }
                logger_1.default.info(`Restored collection: ${collectionName} (${documents.length} documents)`);
            }
            logger_1.default.info('Backup restored successfully');
        }
        catch (error) {
            logger_1.default.error('Restore failed:', error);
            throw error;
        }
    }
    cleanOldBackups(daysToKeep) {
        try {
            const files = fs.readdirSync(BACKUP_DIR);
            const now = Date.now();
            const maxAge = daysToKeep * 24 * 60 * 60 * 1000;
            files.forEach((file) => {
                const filePath = path.join(BACKUP_DIR, file);
                const stats = fs.statSync(filePath);
                const fileAge = now - stats.mtime.getTime();
                if (fileAge > maxAge) {
                    fs.unlinkSync(filePath);
                    logger_1.default.info(`Deleted old backup: ${file}`);
                }
            });
        }
        catch (error) {
            logger_1.default.error('Failed to clean old backups:', error);
        }
    }
    listBackups() {
        try {
            const files = fs.readdirSync(BACKUP_DIR);
            return files
                .filter((file) => file.startsWith('backup-') && file.endsWith('.json'))
                .sort()
                .reverse();
        }
        catch (error) {
            logger_1.default.error('Failed to list backups:', error);
            return [];
        }
    }
    scheduleAutoBackup(cronExpression = '0 2 * * *') {
        node_cron_1.default.schedule(cronExpression, async () => {
            logger_1.default.info('Starting scheduled backup...');
            try {
                await this.createBackup();
                logger_1.default.info('Scheduled backup completed successfully');
            }
            catch (error) {
                logger_1.default.error('Scheduled backup failed:', error);
            }
        });
        logger_1.default.info(`Scheduled automatic backups with cron: ${cronExpression}`);
    }
}
exports.BackupService = BackupService;
exports.backupService = new BackupService();
if (require.main === module) {
    (async () => {
        try {
            logger_1.default.info('Starting manual backup...');
            await exports.backupService.connect();
            await exports.backupService.createBackup();
            await exports.backupService.disconnect();
            logger_1.default.info('Manual backup completed successfully');
            process.exit(0);
        }
        catch (error) {
            logger_1.default.error('Manual backup failed:', error);
            process.exit(1);
        }
    })();
}
//# sourceMappingURL=backup.js.map