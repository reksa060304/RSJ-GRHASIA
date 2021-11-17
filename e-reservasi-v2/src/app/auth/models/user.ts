import { Role } from './role';

export class User {
  id: number;
  email: string;
  password: string;
  firstName: string;
  tgllahir: string;
  lastName: string;
  avatar: string;
  role: Role;
  token?: string;
  pasien:any;
  login:any;
}
