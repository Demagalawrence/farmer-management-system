import { ObjectId } from 'mongodb';

export interface AccessCode {
  _id?: ObjectId;
  role: 'field_officer' | 'finance' | 'manager';
  code: string;
  status: 'active' | 'expired' | 'used';
  created_at: Date;
  expires_at: Date;
  used_at?: Date;
  used_by?: string; // email of user who used it
  created_by?: string; // admin who generated it
}

export interface AccessCodeResponse {
  role: string;
  code: string;
  status: string;
  expires_at: Date;
  time_remaining?: number; // seconds
}
