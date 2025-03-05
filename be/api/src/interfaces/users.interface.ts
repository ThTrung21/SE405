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
  //list of past purchases
  orderHistory: string[];
  address: string;
}
import { Role } from './auth.interface';
