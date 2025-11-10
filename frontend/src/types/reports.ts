export interface ReportPeriod {
  start_date: string;
  end_date: string;
}

export interface ReportRecipient {
  user_id: string;
  name: string;
  email: string;
  role: 'manager' | 'field_officer' | 'finance';
}

export interface Report {
  _id: string;
  type: 'harvest_summary' | 'payment_report' | 'performance' | 'formal_financial_report';
  generated_by: string;
  date_range_start: string;
  date_range_end: string;
  title?: string;
  file_path?: string;
  file_size?: number;
  status?: 'pending' | 'completed' | 'failed';
  error_message?: string;
  created_at: string;
  data?: any;
}

export interface GenerateReportRequest {
  start_date: string;
  end_date: string;
  title?: string;
  recipient_roles?: ('manager' | 'field_officer')[];
  action: 'download' | 'distribute' | 'both';
}

export interface GenerateReportResponse {
  success: boolean;
  message: string;
  data?: {
    report_id: string;
    title: string;
    file_path: string;
    file_size: number;
    period: ReportPeriod;
    recipients_notified: number;
  };
  error?: string;
}

export interface UserReportsResponse {
  success: boolean;
  data: {
    reports: Report[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

export interface Notification {
  _id: string;
  report_id: string;
  recipient_id: string;
  recipient_role: 'manager' | 'field_officer' | 'finance';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  read_at?: string;
}

export interface NotificationResponse {
  success: boolean;
  data?: Notification[] | { count: number };
  message?: string;
}
