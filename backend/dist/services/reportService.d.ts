import { ObjectId } from 'mongodb';
import { Report, ReportInput } from '../models/Report';
export declare class ReportService {
    private collection;
    constructor();
    create(report: ReportInput): Promise<Report>;
    findById(id: string | ObjectId): Promise<Report | null>;
    findByType(type: 'harvest_summary' | 'payment_report' | 'performance'): Promise<Report[]>;
    findByGeneratedBy(userId: string | ObjectId): Promise<Report[]>;
    findAll(): Promise<Report[]>;
    update(id: string | ObjectId, report: Partial<ReportInput>): Promise<Report | null>;
    delete(id: string | ObjectId): Promise<boolean>;
}
//# sourceMappingURL=reportService.d.ts.map