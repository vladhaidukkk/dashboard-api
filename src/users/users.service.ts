import type { UserModel } from '@prisma/client';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';

import type { IConfigService } from './../config/config.service.interface';
import { KEYS } from './../keys';
import type { UserLoginDTO } from './dto/user-login.dto';
import type { UserRegisterDTO } from './dto/user-register.dto';
import { User } from './user.entity';
import type { IUsersRepository } from './users.repository.interface';
import type { IUsersService } from './users.service.interface';

@injectable()
export class UsersService implements IUsersService {
  constructor(
    @inject(KEYS.IConfigService) private configService: IConfigService,
    @inject(KEYS.IUsersRepository) private usersRepository: IUsersRepository
  ) {}

  async createUser({ email, password, name }: UserRegisterDTO): Promise<UserModel | null> {
    const newUser = new User(email, name);
    const salt = Number(this.configService.get('SALT'));
    await newUser.setPassword(password, salt);

    const existingUser = await this.usersRepository.find(newUser.email);
    if (existingUser) {
      return null;
    }
    return this.usersRepository.create(newUser);
  }

  async validateUser({ email, password }: UserLoginDTO): Promise<boolean> {
    const existingUser = await this.usersRepository.find(email);
    if (!existingUser) {
      return false;
    }

    const user = new User(existingUser.email, existingUser.name, existingUser.password);
    return user.comparePassword(password);
  }

  async getUserInfo(email: string): Promise<UserModel | null> {
    return this.usersRepository.find(email);
  }
}
