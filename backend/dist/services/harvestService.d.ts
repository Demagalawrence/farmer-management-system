import { ObjectId } from 'mongodb';
import { Harvest, HarvestInput } from '../models/Harvest';
export declare class HarvestService {
    private collection;
    constructor();
    create(harvest: HarvestInput): Promise<Harvest>;
    findById(id: string | ObjectId): Promise<Harvest | null>;
    findByFarmerId(farmerId: string | ObjectId): Promise<Harvest[]>;
    findByFieldId(fieldId: string | ObjectId): Promise<Harvest[]>;
    findAll(): Promise<Harvest[]>;
    update(id: string | ObjectId, harvest: Partial<HarvestInput>): Promise<Harvest | null>;
    delete(id: string | ObjectId): Promise<boolean>;
}
//# sourceMappingURL=harvestService.d.ts.map