import { inject, injectable } from 'inversify';
import 'reflect-metadata';

import type { IConfigService } from './../config/config.service.interface';
import { KEYS } from './../keys';
import type { UserRegisterDTO } from './dto/user-register.dto';
import { User } from './user.entity';
import type { IUsersService } from './users.service.interface';

@injectable()
export class UsersService implements IUsersService {
  constructor(@inject(KEYS.IConfigService) private configService: IConfigService) {}

  async createUser({ email, password, name }: UserRegisterDTO): Promise<User | null> {
    const newUser = new User(email, name);
    const salt = Number(this.configService.get('SALT'));
    await newUser.setPassword(password, salt);
    return null;
  }
}
