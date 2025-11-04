import { ObjectId } from 'mongodb';
import { Farmer, FarmerInput } from '../models/Farmer';
export declare class FarmerService {
    private collection;
    constructor();
    create(farmer: FarmerInput): Promise<Farmer>;
    findById(id: string | ObjectId): Promise<Farmer | null>;
    findAll(): Promise<Farmer[]>;
    findByUserId(userId: string | ObjectId): Promise<Farmer | null>;
    update(id: string | ObjectId, farmer: Partial<FarmerInput>): Promise<Farmer | null>;
    delete(id: string | ObjectId): Promise<boolean>;
    addField(farmerId: string | ObjectId, field: any): Promise<Farmer | null>;
}
//# sourceMappingURL=farmerService.d.ts.map