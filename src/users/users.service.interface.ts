import type { UserModel } from '@prisma/client';

import type { UserLoginDTO } from './dto/user-login.dto';
import type { UserRegisterDTO } from './dto/user-register.dto';

export interface IUsersService {
  createUser: (dto: UserRegisterDTO) => Promise<UserModel | null>;
  validateUser: (dto: UserLoginDTO) => Promise<boolean>;
}
