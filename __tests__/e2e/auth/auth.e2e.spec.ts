import request from 'supertest';
import { Express } from 'express';
import { stopDB } from '../../../src/db/mongo.db';
import { setupTestApp } from '../../utils/setup-test-app';
import { loginUser } from '../../utils/auth/login-user';
import { createUser } from '../../utils/users/create-user';
import { AUTH_PATH, routersPaths } from '../../../src/core/constants/paths';
import { TUserMeOutput } from '../../../src/users/repositories/output/user-me.output';
import { EHttpStatus } from '../../../src/core/constants/http';
import { jwtService } from '../../../src/auth/adapters/jwt.service';
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

    const { accessToken } = await loginUser({
      app,
      authToken,
      userData: createdUser,
    });

    const decodedAccessToken = await jwtService.decodeAccessToken(accessToken);

    expect(decodedAccessToken!.userId).toBe(createdUser.id);
  });

  it('GET /api/auth/me; должен возвращать текущего пользователя', async () => {
    const createdUser = await createUser({
      app,
      authToken,
      userDto: {
        login: 'newuser1',
        password: getUserDto().password,
        email: 'newUser1@gmail.com',
      },
    });

    const { accessToken } = await loginUser({
      app,
      authToken,
      userData: createdUser,
    });

    const meResponse: TUserMeOutput = {
      userId: createdUser.id,
      email: createdUser.email,
      login: createdUser.login,
    };

    await request(app)
      .get(`${AUTH_PATH}${routersPaths.auth.me}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(EHttpStatus.OK_200)
      .expect(meResponse);
  });
});
