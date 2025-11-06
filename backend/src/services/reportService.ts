import { Collection, ObjectId } from 'mongodb';
import { Report, ReportInput } from '../models/Report';
import { getDb } from '../config/db';

export class ReportService {
  private collection: Collection<Report>;

  constructor() {
    this.collection = getDb().collection<Report>('reports');
  }

  async create(report: ReportInput): Promise<Report> {
    // Normalize fields
    const anyReport: any = { ...report };
    if (anyReport.generated_by) {
      if (typeof anyReport.generated_by === 'string') {
        anyReport.generated_by = new ObjectId(anyReport.generated_by);
      }
    }
    if (anyReport.date_range_start && typeof anyReport.date_range_start === 'string') {
      anyReport.date_range_start = new Date(anyReport.date_range_start);
    }
    if (anyReport.date_range_end && typeof anyReport.date_range_end === 'string') {
      anyReport.date_range_end = new Date(anyReport.date_range_end);
    }
    const newReport: any = {
      ...anyReport,
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

  // Aggregations for charts
  async aggregatePayments(start: Date, end: Date, interval: 'day' | 'month' | 'year' = 'month') {
    const db = getDb();
    const dateField = { $ifNull: ['$payment_date', '$created_at'] };
    const projectStage: any = {
      year: { $year: dateField },
      amount: '$amount',
    };
    if (interval !== 'year') {
      projectStage.month = { $month: dateField };
    }
    if (interval === 'day') {
      projectStage.day = { $dayOfMonth: dateField };
    }
    const groupId: any = { year: '$year' };
    if (interval !== 'year') groupId.month = '$month';
    if (interval === 'day') groupId.day = '$day';
    const cursor = db.collection('payments').aggregate([
      { $match: { $and: [ { $or: [ { payment_date: { $exists: true } }, { created_at: { $exists: true } } ] }, { $expr: { $and: [ { $gte: [ dateField, start ] }, { $lte: [ dateField, end ] } ] } } ] } },
      { $project: projectStage },
      { $group: { _id: groupId, total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
    ]);
    const results = await cursor.toArray();
    return results.map((r: any) => ({
      period: interval === 'year' ? `${r._id.year}` : interval === 'month' ? `${r._id.year}-${String(r._id.month).padStart(2,'0')}` : `${r._id.year}-${String(r._id.month).padStart(2,'0')}-${String(r._id.day).padStart(2,'0')}`,
      total: r.total,
      count: r.count,
    }));
  }

  async aggregateHarvests(start: Date, end: Date, interval: 'day' | 'month' | 'year' = 'month') {
    const db = getDb();
    const dateField = '$harvest_date';
    const projectStage: any = {
      year: { $year: dateField },
      quantity_tons: '$quantity_tons',
    };
    if (interval !== 'year') {
      projectStage.month = { $month: dateField };
    }
    if (interval === 'day') {
      projectStage.day = { $dayOfMonth: dateField };
    }
    const groupId: any = { year: '$year' };
    if (interval !== 'year') groupId.month = '$month';
    if (interval === 'day') groupId.day = '$day';
    const cursor = db.collection('harvests').aggregate([
      { $match: { harvest_date: { $gte: start, $lte: end } } },
      { $project: projectStage },
      { $group: { _id: groupId, total: { $sum: '$quantity_tons' }, count: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
    ]);
    const results = await cursor.toArray();
    return results.map((r: any) => ({
      period: interval === 'year' ? `${r._id.year}` : interval === 'month' ? `${r._id.year}-${String(r._id.month).padStart(2,'0')}` : `${r._id.year}-${String(r._id.month).padStart(2,'0')}-${String(r._id.day).padStart(2,'0')}`,
      total: r.total,
      count: r.count,
    }));
  }
}