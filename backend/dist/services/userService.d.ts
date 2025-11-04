import { ObjectId } from 'mongodb';
import { User, UserInput } from '../models/User';
export declare class UserService {
    private collection;
    constructor();
    create(user: UserInput): Promise<User>;
    findById(id: string | ObjectId): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findAll(): Promise<User[]>;
    update(id: string | ObjectId, user: Partial<UserInput>): Promise<User | null>;
    delete(id: string | ObjectId): Promise<boolean>;
}
//# sourceMappingURL=userService.d.ts.map