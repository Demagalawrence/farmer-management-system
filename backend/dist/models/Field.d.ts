import { ObjectId } from 'mongodb';
export interface Field {
    _id?: ObjectId;
    farmer_id: ObjectId;
    location: string;
    size_hectares: number;
    crop_stage: 'planting' | 'growing' | 'mature' | 'harvest_ready';
    last_inspection_date?: Date;
    health_status: 'healthy' | 'needs_attention' | 'critical';
    created_at: Date;
}
export interface FieldInput {
    farmer_id: ObjectId;
    location: string;
    size_hectares: number;
    crop_stage?: 'planting' | 'growing' | 'mature' | 'harvest_ready';
    last_inspection_date?: Date;
    health_status?: 'healthy' | 'needs_attention' | 'critical';
    created_at?: Date;
}
//# sourceMappingURL=Field.d.ts.map