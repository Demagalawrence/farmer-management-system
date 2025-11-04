import { ObjectId } from 'mongodb';
export interface FieldInfo {
    field_id: ObjectId;
    location: string;
    size_hectares: number;
    crop_stage: 'planting' | 'growing' | 'mature' | 'harvest_ready';
    last_inspection_date?: Date;
    health_status: 'healthy' | 'needs_attention' | 'critical';
}
export interface Farmer {
    _id?: ObjectId;
    user_id: ObjectId;
    name: string;
    contact?: string;
    address?: string;
    registration_date: Date;
    status: 'active' | 'inactive';
    fields: FieldInfo[];
}
export interface FarmerInput {
    user_id: ObjectId;
    name: string;
    contact?: string;
    address?: string;
    registration_date?: Date;
    status?: 'active' | 'inactive';
    fields?: FieldInfo[];
}
//# sourceMappingURL=Farmer.d.ts.map