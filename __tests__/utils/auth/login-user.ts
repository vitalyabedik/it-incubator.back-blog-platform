import request from 'supertest';
import { Express } from 'express';
import { TAuthLoginInput } from '../../../src/auth/routers/input/auth-login.input';
import { AUTH_PATH, routersPaths } from '../../../src/core/constants/paths';
import { EHttpStatus } from '../../../src/core/constants/http';
import { getUserDto } from '../users/get-user-dto';
import { TUserOutput } from '../../../src/users/repositories/output/user.output';

type TArgs = {
  app: Express;
  authToken: string;
  userData: TUserOutput;
};

export const loginUser = async ({ app, userData }: TArgs) => {
  const loginData: TAuthLoginInput = {
    loginOrEmail: userData.login,
    password: getUserDto().password,
  };

  const loginResponse = await request(app)
    .post(`${AUTH_PATH}${routersPaths.auth.login}`)
    .send(loginData)
    .expect(EHttpStatus.OK_200);

  return loginResponse.body;
};
