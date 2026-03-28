import request from 'supertest';
import { Express } from 'express';
import { USERS_PATH } from '../../../src/core/constants/paths';
import { EHttpStatus } from '../../../src/core/constants/http';
import { TUserCreateRequestInput } from '../../../src/users/routes/input/user-create.input';
import { TUserOutput } from '../../../src/users/repositories/output/user.output';
import { getUserDto } from './get-user-dto';

type TCreateUserArgs = {
  app: Express;
  authToken: string;
  userDto?: TUserCreateRequestInput;
};

export const createUser = async ({
  app,
  authToken,
  userDto,
}: TCreateUserArgs): Promise<TUserOutput> => {
  const defaultUserData: TUserCreateRequestInput = getUserDto();

  const testUserData = { ...defaultUserData, ...userDto };

  const createdUserResponse = await request(app)
    .post(USERS_PATH)
    .set('Authorization', authToken)
    .send(testUserData)
    .expect(EHttpStatus.CREATED_201);

  return createdUserResponse.body;
};
