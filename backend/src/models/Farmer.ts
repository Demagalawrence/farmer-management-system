import { ObjectId } from 'mongodb';

export interface FieldInfo {
  field_id: ObjectId;
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  size_hectares: number;
  crop_stage: 'planting' | 'growing' | 'mature' | 'harvest_ready';
  last_inspection_date?: Date;
  health_status: 'healthy' | 'needs_attention' | 'critical';
}

export interface Farmer {
  _id?: ObjectId;
  external_id?: number;
  user_id?: ObjectId;
  name: string;
  email?: string;
  phone?: string;
  contact?: string;
  address?: string;
  farm_size?: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
  registration_date: Date;
  status: 'active' | 'inactive';
  fields: FieldInfo[];
}

export interface FarmerInput {
  external_id?: number;
  user_id?: ObjectId;
  name: string;
  email?: string;
  phone?: string;
  contact?: string;
  address?: string;
  farm_size?: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
  registration_date?: Date;
  status?: 'active' | 'inactive';
  fields?: FieldInfo[];
}