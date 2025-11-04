import { Collection, ObjectId } from 'mongodb';
import { Field, FieldInput } from '../models/Field';
import { getDb } from '../config/db';

export class FieldService {
  private collection: Collection<Field>;

  constructor() {
    this.collection = getDb().collection<Field>('fields');
  }

  async create(field: FieldInput): Promise<Field> {
    const db = getDb();

    // Resolve farmer_id: accept ObjectId string or numeric external_id
    let farmerObjectId: ObjectId;
    if (typeof field.farmer_id === 'number') {
      const farmer = await db.collection('farmers').findOne({ external_id: field.farmer_id });
      if (!farmer || !farmer._id) {
        throw new Error('Farmer with the provided external ID was not found');
      }
      farmerObjectId = new ObjectId(farmer._id);
    } else if (typeof field.farmer_id === 'string') {
      // Handle numeric strings as external_id as a convenience
      if (/^\d+$/.test(field.farmer_id)) {
        const extId = parseInt(field.farmer_id, 10);
        const farmer = await db.collection('farmers').findOne({ external_id: extId });
        if (!farmer || !farmer._id) {
          throw new Error('Farmer with the provided external ID was not found');
        }
        farmerObjectId = new ObjectId(farmer._id);
      } else {
        farmerObjectId = new ObjectId(field.farmer_id);
      }
    } else if (field.farmer_id instanceof ObjectId) {
      farmerObjectId = field.farmer_id as ObjectId;
    } else {
      throw new Error('Invalid farmer_id type');
    }

    // Generate next external_code like F-0001 if not provided
    let externalCode = field.external_code;
    if (!externalCode) {
      const last = await this.collection
        .find({ external_code: { $exists: true } })
        .sort({ external_code: -1 })
        .limit(1)
        .toArray();

      let nextSeq = 1;
      if (last.length && (last[0] as any).external_code) {
        const match = ((last[0] as any).external_code as string).match(/^F-(\d{4})$/);
        if (match) {
          nextSeq = parseInt(match[1], 10) + 1;
        }
      }
      externalCode = `F-${String(nextSeq).padStart(4, '0')}`;
    }

    const newField: any = {
      ...field,
      farmer_id: farmerObjectId,
      external_code: externalCode,
      created_at: field.created_at || new Date(),
      crop_stage: field.crop_stage || 'planting',
      health_status: field.health_status || 'healthy'
    };

    const result = await this.collection.insertOne(newField);
    return { _id: result.insertedId, ...newField };
  }

  async findById(id: string | ObjectId): Promise<Field | null> {
    const objectId = typeof id === 'string' ? new ObjectId(id) : id;
    return await this.collection.findOne({ _id: objectId });
  }

  async findByFarmerId(farmerId: string | ObjectId): Promise<Field[]> {
    const objectId = typeof farmerId === 'string' ? new ObjectId(farmerId) : farmerId;
    return await this.collection.find({ farmer_id: objectId }).toArray();
  }

  async findAll(): Promise<Field[]> {
    return await this.collection.find().toArray();
  }

  async update(id: string | ObjectId, field: Partial<FieldInput>): Promise<Field | null> {
    const objectId = typeof id === 'string' ? new ObjectId(id) : id;
    const result = await this.collection.findOneAndUpdate(
      { _id: objectId },
      { $set: field },
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