import { ObjectId } from 'mongodb';
export interface Harvest {
    _id?: ObjectId;
    field_id: ObjectId;
    farmer_id: ObjectId;
    harvest_date: Date;
    quantity_tons: number;
    quality_grade?: 'A' | 'B' | 'C';
}
export interface HarvestInput {
    field_id: ObjectId;
    farmer_id: ObjectId;
    harvest_date?: Date;
    quantity_tons: number;
    quality_grade?: 'A' | 'B' | 'C';
}
//# sourceMappingURL=Harvest.d.ts.map