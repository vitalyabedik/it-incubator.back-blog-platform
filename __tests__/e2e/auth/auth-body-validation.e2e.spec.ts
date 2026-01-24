import request from 'supertest';
import { Express } from 'express';
import { EHttpStatus } from '../../../src/core/constants/http';
import { stopDB } from '../../../src/db/mongo.db';
import { setupTestApp } from '../../utils/setup-test-app';
import {
  AUTH_PATH,
  routersPaths,
  USERS_PATH,
} from '../../../src/core/constants/paths';
import { TAuthLoginInput } from '../../../src/auth/routers/input/auth-login.input';

describe('Auth API body validation check', () => {
  let app: Express;
  let authToken: string;

  beforeAll(async () => {
    ({ app, authToken } = await setupTestApp());
  });

  afterAll(async () => {
    await stopDB();
  });

  it('POST /api/auth/login; не должен логинить пользователя с некорректным body', async () => {
    const invalidDataSet1: TAuthLoginInput = {
      loginOrEmail: '',
      password: '',
    };
    const invalidDataSetRequest1 = await request(app)
      .post(`${AUTH_PATH}${routersPaths.auth.login}`)
      .send(invalidDataSet1)
      .expect(EHttpStatus.BAD_REQUEST_400);

    expect(invalidDataSetRequest1.body.errorsMessages).toHaveLength(2);

    const invalidDataSet2: TAuthLoginInput = {
      loginOrEmail: '         ',
      password: '       ',
    };
    const invalidDataSetRequest2 = await request(app)
      .post(`${AUTH_PATH}${routersPaths.auth.login}`)
      .send(invalidDataSet2)
      .expect(EHttpStatus.BAD_REQUEST_400);

    expect(invalidDataSetRequest2.body.errorsMessages).toHaveLength(2);

    const invalidDataSet3: TAuthLoginInput = {
      loginOrEmail: 'login',
      password: '5436456',
    };
    await request(app)
      .post(`${AUTH_PATH}${routersPaths.auth.login}`)
      .send(invalidDataSet3)
      .expect(EHttpStatus.UNAUTHORIZED_401);

    const userListResponse = await request(app)
      .get(USERS_PATH)
      .set('Authorization', authToken)
      .expect(EHttpStatus.OK_200);

    expect(userListResponse.body.items).toHaveLength(0);
  });
});
