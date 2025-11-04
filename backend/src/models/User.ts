import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  name: string;
  email: string;
  role: 'farmer' | 'field_officer' | 'finance' | 'manager';
  password_hash: string;
  created_at: Date;
}

export interface UserInput {
  name: string;
  email: string;
  role: 'farmer' | 'field_officer' | 'finance' | 'manager';
  password_hash: string;
}