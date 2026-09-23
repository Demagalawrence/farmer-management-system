export declare class BackupService {
    private client;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    createBackup(): Promise<string>;
    restoreBackup(backupPath: string): Promise<void>;
    cleanOldBackups(daysToKeep: number): void;
    listBackups(): string[];
    scheduleAutoBackup(cronExpression?: string): void;
}
export declare const backupService: BackupService;
//# sourceMappingURL=backup.d.ts.map