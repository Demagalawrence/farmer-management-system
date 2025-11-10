import { ObjectId } from 'mongodb';

export interface Payment {
  _id?: ObjectId;
  farmer_id: ObjectId;
  harvest_id?: ObjectId;
  amount: number;
  rate_per_ton?: number;
  payment_type?: 'advance' | 'final' | 'other';
  description?: string;
  category?: 'seeds' | 'fertilizer' | 'labor' | 'equipment' | 'utilities' | 'maintenance' | 'transport' | 'other';
  payment_method?: 'cash' | 'bank_transfer' | 'mobile_money' | 'check';
  status: 'pending' | 'approved' | 'paid' | 'rejected';
  processed_by?: ObjectId;
  requested_by?: ObjectId;
  requested_at?: Date;
  purpose?: string;
  payment_date?: Date;
  calculation?: any;
  reference?: string;
  created_at: Date;
}

export interface PaymentInput {
  farmer_id: ObjectId;
  harvest_id?: ObjectId;
  amount: number;
  rate_per_ton?: number;
  payment_type?: 'advance' | 'final' | 'other';
  description?: string;
  category?: Payment['category'];
  payment_method?: 'cash' | 'bank_transfer' | 'mobile_money' | 'check';
  status?: 'pending' | 'approved' | 'paid' | 'rejected';
  processed_by?: ObjectId;
  requested_by?: ObjectId;
  requested_at?: Date;
  purpose?: string;
  payment_date?: Date;
  calculation?: any;
  reference?: string;
  created_at?: Date;
}