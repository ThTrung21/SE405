export interface User {
  id?: number;
  email: string;
  password: string;
  fullname: string;
  avatar?: string;
  phone: string;
  dob: Date;
  role: Role;
  likedproduct: string[];
  status: Status;

  //keep track of staff's last assigned chat
  lastAssignedAt?: Date;

  //list of past purchases
  orderHistory: string[];
  address: string;
}
import { Role, Status } from './auth.interface';
