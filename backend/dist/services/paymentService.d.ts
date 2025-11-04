import { ObjectId } from 'mongodb';
import { Payment, PaymentInput } from '../models/Payment';
export declare class PaymentService {
    private collection;
    constructor();
    create(payment: PaymentInput): Promise<Payment>;
    findById(id: string | ObjectId): Promise<Payment | null>;
    findByFarmerId(farmerId: string | ObjectId): Promise<Payment[]>;
    findByStatus(status: 'pending' | 'approved' | 'paid' | 'rejected'): Promise<Payment[]>;
    findAll(): Promise<Payment[]>;
    update(id: string | ObjectId, payment: Partial<PaymentInput>): Promise<Payment | null>;
    delete(id: string | ObjectId): Promise<boolean>;
}
//# sourceMappingURL=paymentService.d.ts.map