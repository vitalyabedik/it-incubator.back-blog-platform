import { TUserCreateRequestInput } from '../../../src/users/routes/input/user-create.input';

export const getUserDto = (): TUserCreateRequestInput => {
  return {
    login: 'newuser',
    password: 'userpassword',
    email: 'newUser@gmail.com',
  };
};
