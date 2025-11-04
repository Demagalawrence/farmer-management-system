import { ObjectId } from 'mongodb';
export interface Report {
    _id?: ObjectId;
    type: 'harvest_summary' | 'payment_report' | 'performance';
    generated_by: ObjectId;
    date_range_start: Date;
    date_range_end: Date;
    data: any;
    created_at: Date;
}
export interface ReportInput {
    type: 'harvest_summary' | 'payment_report' | 'performance';
    generated_by: ObjectId;
    date_range_start: Date;
    date_range_end: Date;
    data: any;
    created_at?: Date;
}
//# sourceMappingURL=Report.d.ts.map