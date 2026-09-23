import { ObjectId } from 'mongodb';
export interface Payment {
    _id?: ObjectId;
    farmer_id: ObjectId;
    harvest_id?: ObjectId;
    amount: number;
    rate_per_ton?: number;
    category?: 'seeds' | 'fertilizer' | 'labor' | 'equipment' | 'utilities' | 'maintenance' | 'transport' | 'other';
    status: 'pending' | 'approved' | 'paid' | 'rejected';
    processed_by?: ObjectId;
    requested_by?: ObjectId;
    requested_at?: Date;
    purpose?: string;
    payment_date?: Date;
    created_at: Date;
}
export interface PaymentInput {
    farmer_id: ObjectId;
    harvest_id?: ObjectId;
    amount: number;
    rate_per_ton?: number;
    category?: Payment['category'];
    status?: 'pending' | 'approved' | 'paid' | 'rejected';
    processed_by?: ObjectId;
    requested_by?: ObjectId;
    requested_at?: Date;
    purpose?: string;
    payment_date?: Date;
    created_at?: Date;
}
//# sourceMappingURL=Payment.d.ts.map