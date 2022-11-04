import request from 'supertest';

import type { App } from '../src/app';
import { boot } from '../src/main';

let application: App;

beforeAll(async () => {
  const { app } = await boot;
  application = app;
});

describe('Users e2e', () => {
  test('/register - error', async () => {
    const res = await request(application.app).post('/users/register').send({
      email: 'some-email',
      password: 'some-password',
      name: 'some-name',
    });

    expect(res.statusCode).toBe(422);
  });

  test('/login - success', async () => {
    const res = await request(application.app).post('/users/login').send({
      email: 'some@gmail.com',
      password: 'some-password',
    });

    expect(res.body.jwt).toBeDefined();
  });

  test('/login - error', async () => {
    const res = await request(application.app).post('/users/login').send({
      email: 'another@gmail.com',
      password: 'another-password',
    });

    expect(res.statusCode).toBe(401);
  });

  test('/info - success', async () => {
    const loginRes = await request(application.app).post('/users/login').send({
      email: 'some@gmail.com',
      password: 'some-password',
    });
    const res = await request(application.app)
      .get('/users/info')
      .set('Authorization', `Bearer ${loginRes.body.jwt}`);

    expect(res.body.email).toBe('some@gmail.com');
  });

  test('/info - error', async () => {
    const res = await request(application.app)
      .get('/users/info')
      .set('Authorization', 'Bearer some-jwt');

    expect(res.statusCode).toBe(401);
  });
});

afterAll(() => {
  application.close();
});
