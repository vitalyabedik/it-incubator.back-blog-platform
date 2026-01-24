import request from 'supertest';
import { Express } from 'express';
import { USERS_PATH } from '../../../src/core/constants/paths';
import { EHttpStatus } from '../../../src/core/constants/http';
import { stopDB } from '../../../src/db/mongo.db';
import { setupTestApp } from '../../utils/setup-test-app';
import { createUser } from '../../utils/users/create-user';

describe('User API', () => {
  let app: Express;
  let authToken: string;

  beforeAll(async () => {
    ({ app, authToken } = await setupTestApp());
  });

  afterAll(async () => {
    await stopDB();
  });

  it('POST /api/users; должен создавать user', async () => {
    await createUser({ app, authToken });
  });

  it('GET /api/users; должен возвращать user list', async () => {
    await createUser({
      app,
      authToken,
      userDto: {
        login: 'banana',
        password: 'passqwer',
        email: 'developer@gmail.com',
      },
    });
    await createUser({
      app,
      authToken,
      userDto: {
        login: 'pocco',
        password: 'passtryrty',
        email: 'samurai@gmail.com',
      },
    });

    const response = await request(app)
      .get(USERS_PATH)
      .set('Authorization', authToken)
      .expect(EHttpStatus.OK_200);

    expect(response.body.items).toBeInstanceOf(Array);
    expect(response.body.items.length).toBeGreaterThanOrEqual(2);
  });

  it('DELETE /api/users/:id; должен удалять user по id', async () => {
    const createdUser = await createUser({
      app,
      authToken,
      userDto: {
        login: 'cucumber',
        password: 'passhgjghj',
        email: 'test@gmail.com',
      },
    });

    await request(app)
      .delete(`${USERS_PATH}/${createdUser.id}`)
      .set('Authorization', authToken)
      .expect(EHttpStatus.NO_CONTENT_204);

    await request(app)
      .get(`${USERS_PATH}/${createdUser.id}`)
      .expect(EHttpStatus.NOT_FOUND_404);
  });
});
