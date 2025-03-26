export interface User {
  id?: number;
  email: string;
  password: string;
  fullname: string;
  avatar?: string;
  phone: string;
  dob: Date;
  role: Role;
}
import { Role } from './auth.interface';
