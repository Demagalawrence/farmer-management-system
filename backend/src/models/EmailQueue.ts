import { ObjectId } from 'mongodb';

export interface EmailQueue {
  _id?: ObjectId;
  to: string;
  subject: string;
  html: string;
  from?: string;
  payment_id?: string;
  farmer_name?: string;
  status: 'pending' | 'sent' | 'failed';
  attempts: number;
  max_attempts: number;
  last_attempt_at?: Date;
  last_error?: string;
  created_at: Date;
  sent_at?: Date;
}

export interface EmailQueueInput {
  to: string;
  subject: string;
  html: string;
  from?: string;
  payment_id?: string;
  farmer_name?: string;
  max_attempts?: number;
}
