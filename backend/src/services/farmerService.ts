import { Collection, ObjectId } from 'mongodb';
import { Farmer, FarmerInput } from '../models/Farmer';
import { getDb } from '../config/db';

export class FarmerService {
  private collection: Collection<Farmer>;

  constructor() {
    this.collection = getDb().collection<Farmer>('farmers');
  }

  async create(farmer: FarmerInput): Promise<Farmer> {
    // Use provided external_id if present (ensure unique), else auto-assign next
    let nextExternalId = farmer.external_id;
    if (nextExternalId != null) {
      const exists = await this.collection.findOne({ external_id: nextExternalId });
      if (exists) {
        throw new Error(`external_id ${nextExternalId} is already in use`);
      }
    } else {
      const last = await this.collection
        .find({ external_id: { $exists: true } })
        .sort({ external_id: -1 })
        .limit(1)
        .toArray();
      nextExternalId = last.length ? ((last[0] as any).external_id || 0) + 1 : 1;
    }

    const newFarmer: any = {
      ...farmer,
      external_id: nextExternalId,
      registration_date: farmer.registration_date || new Date(),
      status: farmer.status || 'active',
      fields: farmer.fields || []
    };

    const result = await this.collection.insertOne(newFarmer);
    return { _id: result.insertedId, ...newFarmer };
  }

  async findById(id: string | ObjectId): Promise<Farmer | null> {
    const objectId = typeof id === 'string' ? new ObjectId(id) : id;
    return await this.collection.findOne({ _id: objectId });
  }

  async findAll(): Promise<Farmer[]> {
    return await this.collection.find().toArray();
  }

  async findByUserId(userId: string | ObjectId): Promise<Farmer | null> {
    const objectId = typeof userId === 'string' ? new ObjectId(userId) : userId;
    return await this.collection.findOne({ user_id: objectId });
  }

  async update(id: string | ObjectId, farmer: Partial<FarmerInput>): Promise<Farmer | null> {
    const objectId = typeof id === 'string' ? new ObjectId(id) : id;
    const result = await this.collection.findOneAndUpdate(
      { _id: objectId },
      { $set: farmer },
      { returnDocument: 'after' }
    );
    return result;
  }

  async delete(id: string | ObjectId): Promise<boolean> {
    const objectId = typeof id === 'string' ? new ObjectId(id) : id;
    const result = await this.collection.deleteOne({ _id: objectId });
    return result.deletedCount === 1;
  }

  async addField(farmerId: string | ObjectId, field: any): Promise<Farmer | null> {
    const objectId = typeof farmerId === 'string' ? new ObjectId(farmerId) : farmerId;
    const result = await this.collection.findOneAndUpdate(
      { _id: objectId },
      { $push: { fields: field } },
      { returnDocument: 'after' }
    );
    return result;
  }
}