import { injectable } from 'inversify';
import 'reflect-metadata';

import type { UserRegisterDTO } from './dto/user-register.dto';
import { User } from './user.entity';
import type { IUsersService } from './users.service.interface';

@injectable()
export class UsersService implements IUsersService {
  async createUser({ email, password, name }: UserRegisterDTO): Promise<User | null> {
    const newUser = new User(email, name);
    await newUser.setPassword(password);
    return null;
  }
}
