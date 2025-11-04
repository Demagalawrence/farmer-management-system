import { Collection, ObjectId } from 'mongodb';
import { Report, ReportInput } from '../models/Report';
import { getDb } from '../config/db';

export class ReportService {
  private collection: Collection<Report>;

  constructor() {
    this.collection = getDb().collection<Report>('reports');
  }

  async create(report: ReportInput): Promise<Report> {
    const newReport: any = {
      ...report,
      created_at: report.created_at || new Date()
    };

    const result = await this.collection.insertOne(newReport);
    return { _id: result.insertedId, ...newReport };
  }

  async findById(id: string | ObjectId): Promise<Report | null> {
    const objectId = typeof id === 'string' ? new ObjectId(id) : id;
    return await this.collection.findOne({ _id: objectId });
  }

  async findByType(type: 'harvest_summary' | 'payment_report' | 'performance'): Promise<Report[]> {
    return await this.collection.find({ type }).toArray();
  }

  async findByGeneratedBy(userId: string | ObjectId): Promise<Report[]> {
    const objectId = typeof userId === 'string' ? new ObjectId(userId) : userId;
    return await this.collection.find({ generated_by: objectId }).toArray();
  }

  async findAll(): Promise<Report[]> {
    return await this.collection.find().toArray();
  }

  async update(id: string | ObjectId, report: Partial<ReportInput>): Promise<Report | null> {
    const objectId = typeof id === 'string' ? new ObjectId(id) : id;
    const result = await this.collection.findOneAndUpdate(
      { _id: objectId },
      { $set: report },
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