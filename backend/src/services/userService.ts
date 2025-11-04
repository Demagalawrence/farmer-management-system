import { Collection, ObjectId, WithId } from 'mongodb';
import { User, UserInput } from '../models/User';
import { getDb } from '../config/db';

export class UserService {
  private collection: Collection<User>;

  constructor() {
    this.collection = getDb().collection<User>('users');
  }

  async create(user: UserInput): Promise<User> {
    const newUser: any = {
      ...user,
      created_at: new Date()
    };

    const result = await this.collection.insertOne(newUser);
    return { _id: result.insertedId, ...newUser };
  }

  async findById(id: string | ObjectId): Promise<User | null> {
    const objectId = typeof id === 'string' ? new ObjectId(id) : id;
    return await this.collection.findOne({ _id: objectId });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.collection.findOne({ email });
  }

  async findAll(): Promise<User[]> {
    return await this.collection.find().toArray();
  }

  async update(id: string | ObjectId, user: Partial<UserInput>): Promise<User | null> {
    const objectId = typeof id === 'string' ? new ObjectId(id) : id;
    const result = await this.collection.findOneAndUpdate(
      { _id: objectId },
      { $set: user },
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