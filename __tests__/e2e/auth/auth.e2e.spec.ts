import request from 'supertest';
import { Express } from 'express';
import { AUTH_PATH, routersPaths } from '../../../src/core/constants/paths';
import { EHttpStatus } from '../../../src/core/constants/http';
import { stopDB } from '../../../src/db/mongo.db';
import { setupTestApp } from '../../utils/setup-test-app';
import { TAuthLoginInput } from '../../../src/auth/routers/input/auth-login.input';
import { createUser } from '../../utils/users/create-user';
import { getUserDto } from '../../utils/users/get-user-dto';

describe('Auth API', () => {
  let app: Express;
  let authToken: string;

  beforeAll(async () => {
    ({ app, authToken } = await setupTestApp());
  });

  afterAll(async () => {
    await stopDB();
  });

  it('POST /api/auth/login; должен логинить пользователя', async () => {
    const createdUser = await createUser({ app, authToken });

    const loginData: TAuthLoginInput = {
      loginOrEmail: createdUser.login,
      password: getUserDto().password,
    };

    await request(app)
      .post(`${AUTH_PATH}${routersPaths.auth.login}`)
      .send(loginData)
      .expect(EHttpStatus.NO_CONTENT_204);
  });
});
