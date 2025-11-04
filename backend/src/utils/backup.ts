import { MongoClient } from 'mongodb';
import * as fs from 'fs';
import * as path from 'path';
import cron from 'node-cron';
import logger from './logger';

const BACKUP_DIR = process.env.BACKUP_DIR || path.join(process.cwd(), 'backups');
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fmis';
const DB_NAME = process.env.DB_NAME || 'fmis';

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

export class BackupService {
  private client: MongoClient | null = null;

  async connect(): Promise<void> {
    try {
      this.client = new MongoClient(MONGODB_URI);
      await this.client.connect();
      logger.info('Connected to MongoDB for backup');
    } catch (error) {
      logger.error('Failed to connect to MongoDB for backup:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      logger.info('Disconnected from MongoDB');
    }
  }

  async createBackup(): Promise<string> {
    try {
      if (!this.client) {
        await this.connect();
      }

      const db = this.client!.db(DB_NAME);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFileName = `backup-${timestamp}.json`;
      const backupPath = path.join(BACKUP_DIR, backupFileName);

      // Get all collections
      const collections = await db.listCollections().toArray();
      const backup: any = {
        timestamp: new Date().toISOString(),
        database: DB_NAME,
        collections: {},
      };

      // Backup each collection
      for (const collectionInfo of collections) {
        const collectionName = collectionInfo.name;
        const collection = db.collection(collectionName);
        const documents = await collection.find({}).toArray();
        
        backup.collections[collectionName] = documents;
        logger.info(`Backed up collection: ${collectionName} (${documents.length} documents)`);
      }

      // Write backup to file
      fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));
      logger.info(`Backup created successfully: ${backupPath}`);

      // Clean old backups (keep last 30 days)
      this.cleanOldBackups(30);

      return backupPath;
    } catch (error) {
      logger.error('Backup failed:', error);
      throw error;
    }
  }

  async restoreBackup(backupPath: string): Promise<void> {
    try {
      if (!this.client) {
        await this.connect();
      }

      const db = this.client!.db(DB_NAME);

      // Read backup file
      const backupData = JSON.parse(fs.readFileSync(backupPath, 'utf-8'));

      logger.info(`Restoring backup from: ${backupPath}`);

      // Restore each collection
      for (const [collectionName, documents] of Object.entries(backupData.collections)) {
        const collection = db.collection(collectionName);
        
        // Clear existing data
        await collection.deleteMany({});
        
        // Insert backup data
        if (Array.isArray(documents) && documents.length > 0) {
          await collection.insertMany(documents as any[]);
        }
        
        logger.info(`Restored collection: ${collectionName} (${(documents as any[]).length} documents)`);
      }

      logger.info('Backup restored successfully');
    } catch (error) {
      logger.error('Restore failed:', error);
      throw error;
    }
  }

  cleanOldBackups(daysToKeep: number): void {
    try {
      const files = fs.readdirSync(BACKUP_DIR);
      const now = Date.now();
      const maxAge = daysToKeep * 24 * 60 * 60 * 1000; // Convert days to milliseconds

      files.forEach((file) => {
        const filePath = path.join(BACKUP_DIR, file);
        const stats = fs.statSync(filePath);
        const fileAge = now - stats.mtime.getTime();

        if (fileAge > maxAge) {
          fs.unlinkSync(filePath);
          logger.info(`Deleted old backup: ${file}`);
        }
      });
    } catch (error) {
      logger.error('Failed to clean old backups:', error);
    }
  }

  listBackups(): string[] {
    try {
      const files = fs.readdirSync(BACKUP_DIR);
      return files
        .filter((file) => file.startsWith('backup-') && file.endsWith('.json'))
        .sort()
        .reverse();
    } catch (error) {
      logger.error('Failed to list backups:', error);
      return [];
    }
  }

  scheduleAutoBackup(cronExpression: string = '0 2 * * *'): void {
    // Default: Run daily at 2 AM
    cron.schedule(cronExpression, async () => {
      logger.info('Starting scheduled backup...');
      try {
        await this.createBackup();
        logger.info('Scheduled backup completed successfully');
      } catch (error) {
        logger.error('Scheduled backup failed:', error);
      }
    });

    logger.info(`Scheduled automatic backups with cron: ${cronExpression}`);
  }
}

// Create singleton instance
export const backupService = new BackupService();

// CLI script for manual backup
if (require.main === module) {
  (async () => {
    try {
      logger.info('Starting manual backup...');
      await backupService.connect();
      await backupService.createBackup();
      await backupService.disconnect();
      logger.info('Manual backup completed successfully');
      process.exit(0);
    } catch (error) {
      logger.error('Manual backup failed:', error);
      process.exit(1);
    }
  })();
}
