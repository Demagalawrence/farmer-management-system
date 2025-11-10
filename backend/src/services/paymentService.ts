import { Collection, ObjectId } from 'mongodb';
import { Payment, PaymentInput } from '../models/Payment';
import { getDb } from '../config/db';
import { sendPaymentEmail } from '../utils/email';

export class PaymentService {
  private collection: Collection<Payment>;

  constructor() {
    this.collection = getDb().collection<Payment>('payments');
  }

  async create(payment: PaymentInput): Promise<Payment> {
    const db = getDb();

    // Resolve farmer_id: accept ObjectId string or numeric external_id
    let farmerObjectId: ObjectId;
    const anyPayment: any = payment as any;
    // Sanitize optional harvest_id so we don't store null/empty strings
    if ('harvest_id' in anyPayment) {
      if (anyPayment.harvest_id === null || anyPayment.harvest_id === undefined || anyPayment.harvest_id === '' ) {
        delete anyPayment.harvest_id;
      }
    }
    if (typeof anyPayment.farmer_id === 'number') {
      const farmer = await db.collection('farmers').findOne({ external_id: anyPayment.farmer_id });
      if (!farmer || !farmer._id) {
        throw new Error('Farmer with the provided external ID was not found');
      }
      farmerObjectId = new ObjectId(farmer._id);
    } else if (typeof anyPayment.farmer_id === 'string') {
      if (/^\d+$/.test(anyPayment.farmer_id)) {
        const extId = parseInt(anyPayment.farmer_id, 10);
        const farmer = await db.collection('farmers').findOne({ external_id: extId });
        if (!farmer || !farmer._id) {
          throw new Error('Farmer with the provided external ID was not found');
        }
        farmerObjectId = new ObjectId(farmer._id);
      } else {
        farmerObjectId = new ObjectId(anyPayment.farmer_id);
      }
    } else if (anyPayment.farmer_id instanceof ObjectId) {
      farmerObjectId = anyPayment.farmer_id as ObjectId;
    } else {
      throw new Error('Invalid farmer_id type');
    }

    const newPayment: any = {
      ...payment,
      farmer_id: farmerObjectId,
      created_at: payment.created_at || new Date(),
      status: payment.status || 'pending'
    };

    const result = await this.collection.insertOne(newPayment);
    return { _id: result.insertedId, ...newPayment };
  }

  async findById(id: string | ObjectId): Promise<Payment | null> {
    const objectId = typeof id === 'string' ? new ObjectId(id) : id;
    return await this.collection.findOne({ _id: objectId });
  }

  async findByFarmerId(farmerId: string | ObjectId): Promise<Payment[]> {
    const objectId = typeof farmerId === 'string' ? new ObjectId(farmerId) : farmerId;
    return await this.collection.find({ farmer_id: objectId }).toArray();
  }

  async findByStatus(status: 'pending' | 'approved' | 'paid' | 'rejected'): Promise<Payment[]> {
    return await this.collection.find({ status }).toArray();
  }

  async findAll(): Promise<Payment[]> {
    return await this.collection.find().toArray();
  }

  async update(id: string | ObjectId, payment: Partial<PaymentInput>): Promise<Payment | null> {
    const objectId = typeof id === 'string' ? new ObjectId(id) : id;
    const result = await this.collection.findOneAndUpdate(
      { _id: objectId },
      { $set: payment },
      { returnDocument: 'after' }
    );
    // Send payment completion email when payment is marked as paid
    try {
      if (payment && (payment as any).status === 'paid' && result) {
        const db = getDb();
        const farmer = await db.collection('farmers').findOne({ _id: (result as any).farmer_id });
        if (farmer && farmer.email) {
          const amount = (result as any).amount;
          const paymentId = String(result._id);
          const paymentType = (result as any).payment_type || 'payment';
          const calculation = (result as any).calculation;
          await sendPaymentEmail(
            farmer.email,
            farmer.name || 'Farmer',
            amount,
            paymentId,
            paymentType,
            calculation
          );
        }
      }
    } catch (e) {
      console.error('Failed to send payment completion email:', e);
    }
    try {
      if (payment && (payment as any).status === 'paid' && result) {
        const db = getDb();
        await db.collection('notifications').insertOne({
          type: 'payment_processed',
          payment_id: objectId,
          farmer_id: (result as any).farmer_id,
          amount: (result as any).amount,
          created_at: new Date(),
          audience: 'manager',
          read: false,
        });
      }
    } catch (e) {
      console.error('Failed to create notification for payment:', e);
    }
    return result;
  }

  async delete(id: string | ObjectId): Promise<boolean> {
    const objectId = typeof id === 'string' ? new ObjectId(id) : id;
    const result = await this.collection.deleteOne({ _id: objectId });
    return result.deletedCount === 1;
  }
}