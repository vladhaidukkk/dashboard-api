import type { UserModel } from '@prisma/client';
import { inject, injectable } from 'inversify';

import type { IPrismaService } from './../database/prisma.service.interface';
import { KEYS } from './../keys';
import type { User } from './user.entity';
import type { IUsersRepository } from './users.repository.interface';

@injectable()
export class UsersRepository implements IUsersRepository {
  constructor(@inject(KEYS.IPrismaService) private prismaService: IPrismaService) {}

  async create({ email, password, name }: User): Promise<UserModel> {
    return this.prismaService.client.userModel.create({
      data: {
        email,
        password,
        name,
      },
    });
  }

  async find(email: string): Promise<UserModel | null> {
    return this.prismaService.client.userModel.findFirst({
      where: {
        email,
      },
    });
  }
}
