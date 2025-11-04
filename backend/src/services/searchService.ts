import { Db, ObjectId } from 'mongodb';
import { getDb } from '../config/db';

export interface SearchResults {
  users: any[];
  farmers: any[];
  fields: any[];
  harvests: any[];
  payments: any[];
  reports: any[];
}

export class SearchService {
  private db: Db;

  constructor() {
    this.db = getDb();
  }

  async searchByObjectId(id: string | ObjectId): Promise<SearchResults> {
    const objectId = typeof id === 'string' ? new ObjectId(id) : id;

    // Users: match _id
    const users = await this.db.collection('users')
      .find({ _id: objectId })
      .toArray();

    // Farmers: match _id or user_id
    const farmers = await this.db.collection('farmers')
      .find({ $or: [ { _id: objectId }, { user_id: objectId } ] })
      .toArray();

    // Fields: match _id or farmer_id
    const fields = await this.db.collection('fields')
      .find({ $or: [ { _id: objectId }, { farmer_id: objectId } ] })
      .toArray();

    // Harvests: match _id, field_id, farmer_id
    const harvests = await this.db.collection('harvests')
      .find({ $or: [ { _id: objectId }, { field_id: objectId }, { farmer_id: objectId } ] })
      .toArray();

    // Payments: match _id, farmer_id, harvest_id, processed_by
    const payments = await this.db.collection('payments')
      .find({ $or: [ { _id: objectId }, { farmer_id: objectId }, { harvest_id: objectId }, { processed_by: objectId } ] })
      .toArray();

    // Reports: match _id, generated_by
    const reports = await this.db.collection('reports')
      .find({ $or: [ { _id: objectId }, { generated_by: objectId } ] })
      .toArray();

    return { users, farmers, fields, harvests, payments, reports };
  }
}
