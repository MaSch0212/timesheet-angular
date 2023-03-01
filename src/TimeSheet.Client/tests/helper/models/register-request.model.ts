import { User } from './user.model';

export interface RegisterRequest {
  userInfo: User;
  username: string;
  password: string;
}
