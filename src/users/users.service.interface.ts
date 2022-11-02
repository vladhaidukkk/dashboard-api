import type { UserRegisterDTO } from './dto/user-register.dto';
import type { User } from './user.entity';

export interface IUsersService {
  createUser: (dto: UserRegisterDTO) => Promise<User | null>;
}
