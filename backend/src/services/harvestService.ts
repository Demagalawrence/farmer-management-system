import { Collection, ObjectId } from 'mongodb';
import { Harvest, HarvestInput } from '../models/Harvest';
import { getDb } from '../config/db';

export class HarvestService {
  private collection: Collection<Harvest>;

  constructor() {
    this.collection = getDb().collection<Harvest>('harvests');
  }

  async create(harvest: HarvestInput): Promise<Harvest> {
    const newHarvest: any = {
      ...harvest,
      harvest_date: harvest.harvest_date || new Date()
    };

    const result = await this.collection.insertOne(newHarvest);
    return { _id: result.insertedId, ...newHarvest };
  }

  async findById(id: string | ObjectId): Promise<Harvest | null> {
    const objectId = typeof id === 'string' ? new ObjectId(id) : id;
    return await this.collection.findOne({ _id: objectId });
  }

  async findByFarmerId(farmerId: string | ObjectId): Promise<Harvest[]> {
    const objectId = typeof farmerId === 'string' ? new ObjectId(farmerId) : farmerId;
    return await this.collection.find({ farmer_id: objectId }).toArray();
  }

  async findByFieldId(fieldId: string | ObjectId): Promise<Harvest[]> {
    const objectId = typeof fieldId === 'string' ? new ObjectId(fieldId) : fieldId;
    return await this.collection.find({ field_id: objectId }).toArray();
  }

  async findAll(): Promise<Harvest[]> {
    return await this.collection.find().toArray();
  }

  async update(id: string | ObjectId, harvest: Partial<HarvestInput>): Promise<Harvest | null> {
    const objectId = typeof id === 'string' ? new ObjectId(id) : id;
    const result = await this.collection.findOneAndUpdate(
      { _id: objectId },
      { $set: harvest },
      { returnDocument: 'after' }
    );
    return result;
  }

  async delete(id: string | ObjectId): Promise<boolean> {
    const objectId = typeof id === 'string' ? new ObjectId(id) : id;
    const result = await this.collection.deleteOne({ _id: objectId });
    return result.deletedCount === 1;
  }
}