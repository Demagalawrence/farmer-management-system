import { ObjectId } from 'mongodb';

export interface Notification {
  _id?: ObjectId;
  report_id: ObjectId;
  recipient_id: ObjectId;
  recipient_role: 'manager' | 'field_officer' | 'finance';
  title: string;
  message: string;
  read: boolean;
  created_at: Date;
  read_at?: Date;
}

export interface NotificationInput {
  report_id: ObjectId | string;
  recipient_id: ObjectId | string;
  recipient_role: 'manager' | 'field_officer' | 'finance';
  title: string;
  message: string;
  read?: boolean;
  created_at?: Date;
}
