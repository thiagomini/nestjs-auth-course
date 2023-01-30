import { Role } from '../../../users/enums/roles.enum';

export interface ActiveUserData {
  sub: number;
  email: string;
  role: Role;
}
