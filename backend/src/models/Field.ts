import { ObjectId } from 'mongodb';

export interface Field {
  _id?: ObjectId;
  farmer_id: ObjectId;
  external_code?: string;
  location: string;
  size_hectares: number;
  crop_stage: 'planting' | 'growing' | 'mature' | 'harvest_ready';
  last_inspection_date?: Date;
  health_status: 'healthy' | 'needs_attention' | 'critical';
  crop_type?: string;
  variety?: string;
  expected_yield_kg?: number;
  planting_date?: Date;
  visit_type?: 'planting' | 'monitoring' | 'harvest';
  notes?: string;
  created_at: Date;
}

export interface FieldInput {
  farmer_id: any;
  external_code?: string;
  location: string;
  size_hectares: number;
  crop_stage?: 'planting' | 'growing' | 'mature' | 'harvest_ready';
  last_inspection_date?: Date;
  health_status?: 'healthy' | 'needs_attention' | 'critical';
  crop_type?: string;
  variety?: string;
  expected_yield_kg?: number;
  planting_date?: Date;
  visit_type?: 'planting' | 'monitoring' | 'harvest';
  notes?: string;
  created_at?: Date;
}