import { ObjectId } from 'mongodb';
export interface Budget {
    _id?: ObjectId;
    period: string;
    category: 'seeds' | 'fertilizer' | 'labor' | 'equipment' | 'utilities' | 'maintenance' | 'transport' | 'other';
    allocated: number;
    notes?: string;
    created_at: Date;
    updated_at?: Date;
}
export interface BudgetInput {
    period: string;
    category: Budget['category'];
    allocated: number;
    notes?: string;
}
//# sourceMappingURL=Budget.d.ts.map