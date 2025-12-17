import { User } from './user.model';
import { Cus } from './cus.model';

export interface Transaction {
  id: string;
  user: User;
  amount: number;
  cus: Cus;
  createdAt: Date;
}
