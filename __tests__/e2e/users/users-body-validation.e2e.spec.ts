import request from 'supertest';
import { Express } from 'express';
import { EHttpStatus } from '../../../src/core/constants/http';
import { stopDB } from '../../../src/db/mongo.db';
import { setupTestApp } from '../../utils/setup-test-app';
import { TUserCreateInput } from '../../../src/users/routes/input/user-create.input';
import { getUserDto } from '../../utils/users/get-user-dto';
import { USERS_PATH } from '../../../src/core/constants/paths';
import {
  USER_LOGIN_MAX_FIELD_LENGTH,
  USER_PASSWORD_MAX_FIELD_LENGTH,
} from '../../../src/users/constants/validation';

describe('User API body validation check', () => {
  let app: Express;
  let authToken: string;

  const correctTestUserData: TUserCreateInput = getUserDto();
  const errorsLength = Object.keys(correctTestUserData).length;

  beforeAll(async () => {
    ({ app, authToken } = await setupTestApp());
  });

  afterAll(async () => {
    await stopDB();
  });

  it('POST /api/users; не должен создавать user с некорректным body', async () => {
    const invalidDataSet1: TUserCreateInput = {
      login: '',
      password: '',
      email: '',
    };
    const invalidDataSetRequest1 = await request(app)
      .post(USERS_PATH)
      .set('Authorization', authToken)
      .send(invalidDataSet1)
      .expect(EHttpStatus.BAD_REQUEST_400);

    expect(invalidDataSetRequest1.body.errorsMessages).toHaveLength(
      errorsLength,
    );

    const invalidDataSet2: TUserCreateInput = {
      login: '         ',
      password: '       ',
      email: 'incorrect-email.com',
    };
    const invalidDataSetRequest2 = await request(app)
      .post(USERS_PATH)
      .set('Authorization', authToken)
      .send(invalidDataSet2)
      .expect(EHttpStatus.BAD_REQUEST_400);

    expect(invalidDataSetRequest2.body.errorsMessages).toHaveLength(
      errorsLength,
    );

    const invalidDataSet3: TUserCreateInput = {
      login: '1'.repeat(USER_LOGIN_MAX_FIELD_LENGTH + 1),
      password: '2'.repeat(USER_PASSWORD_MAX_FIELD_LENGTH + 1),
      email: `incorrect-email@45dfg`,
    };
    const invalidDataSetRequest3 = await request(app)
      .post(USERS_PATH)
      .set('Authorization', authToken)
      .send(invalidDataSet3)
      .expect(EHttpStatus.BAD_REQUEST_400);

    expect(invalidDataSetRequest3.body.errorsMessages).toHaveLength(
      errorsLength,
    );

    const userListResponse = await request(app)
      .get(USERS_PATH)
      .set('Authorization', authToken)
      .expect(EHttpStatus.OK_200);

    expect(userListResponse.body.items).toHaveLength(0);
  });
});
