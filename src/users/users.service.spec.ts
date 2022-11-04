import type { UserModel } from '@prisma/client';
import { Container } from 'inversify';

import type { IConfigService } from './../config/config.service.interface';
import { KEYS } from './../keys';
import type { User } from './user.entity';
import type { IUsersRepository } from './users.repository.interface';
import { UsersService } from './users.service';
import type { IUsersService } from './users.service.interface';

const ConfigServiceMock: IConfigService = {
  get: jest.fn(),
};

const UsersRepositoryMock: IUsersRepository = {
  create: jest.fn(),
  find: jest.fn(),
};

let usersService: IUsersService;
let configService: IConfigService;
let usersRepository: IUsersRepository;

let createUser: UserModel | null;

beforeAll(() => {
  const container = new Container();
  container.bind<IUsersService>(KEYS.IUsersService).to(UsersService);
  container.bind<IConfigService>(KEYS.IConfigService).toConstantValue(ConfigServiceMock);
  container.bind<IUsersRepository>(KEYS.IUsersRepository).toConstantValue(UsersRepositoryMock);

  usersService = container.get<IUsersService>(KEYS.IUsersService);
  configService = container.get<IConfigService>(KEYS.IConfigService);
  usersRepository = container.get<IUsersRepository>(KEYS.IUsersRepository);
});

describe('Users Service', () => {
  test('createUser - success', async () => {
    configService.get = jest.fn().mockReturnValueOnce('1');
    usersRepository.create = jest.fn().mockImplementationOnce(
      (user: User): UserModel => ({
        id: 1,
        email: user.email,
        password: user.password,
        name: user.name,
      })
    );
    createUser = await usersService.createUser({
      email: 'some@gmail.com',
      password: 'some-password',
      name: 'some-name',
    });

    expect(createUser?.id).toEqual(1);
    expect(createUser?.password).not.toEqual('some-password');
  });

  test('validateUser - success', async () => {
    usersRepository.find = jest.fn().mockReturnValueOnce(createUser);
    const res = await usersService.validateUser({
      email: 'some@gmail.com',
      password: 'some-password',
    });

    expect(res).toBeTruthy();
  });

  test('validateUser - wrong password', async () => {
    usersRepository.find = jest.fn().mockReturnValueOnce(createUser);
    const res = await usersService.validateUser({
      email: 'some@gmail.com',
      password: 'another-password',
    });

    expect(res).toBeFalsy();
  });

  test('validateUser - wrong user', async () => {
    usersRepository.find = jest.fn().mockReturnValueOnce(null);
    const res = await usersService.validateUser({
      email: 'another@gmail.com',
      password: 'another-password',
    });

    expect(res).toBeFalsy();
  });
});
