import { ObjectId } from 'mongodb';
import { Field, FieldInput } from '../models/Field';
export declare class FieldService {
    private collection;
    constructor();
    create(field: FieldInput): Promise<Field>;
    findById(id: string | ObjectId): Promise<Field | null>;
    findByFarmerId(farmerId: string | ObjectId): Promise<Field[]>;
    findAll(): Promise<Field[]>;
    update(id: string | ObjectId, field: Partial<FieldInput>): Promise<Field | null>;
    delete(id: string | ObjectId): Promise<boolean>;
}
//# sourceMappingURL=fieldService.d.ts.map