import { ObjectId } from 'mongodb';

export interface Report {
  _id?: ObjectId;
  type: 'harvest_summary' | 'payment_report' | 'performance' | 'formal_financial_report';
  generated_by: ObjectId;
  date_range_start: Date;
  date_range_end: Date;
  data: any; // Flexible structure for report data
  created_at: Date;
  // New fields for formal PDF reports
  title?: string;
  file_path?: string;
  file_size?: number;
  status?: 'pending' | 'completed' | 'failed';
  error_message?: string;
}

export interface ReportInput {
  type: 'harvest_summary' | 'payment_report' | 'performance' | 'formal_financial_report';
  generated_by: ObjectId;
  date_range_start: Date;
  date_range_end: Date;
  data: any; // Flexible structure for report data
  created_at?: Date;
  title?: string;
  file_path?: string;
  file_size?: number;
  status?: 'pending' | 'completed' | 'failed';
  error_message?: string;
}