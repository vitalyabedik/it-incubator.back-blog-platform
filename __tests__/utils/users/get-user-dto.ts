import { TUserCreateInput } from '../../../src/users/routes/input/user-create.input';

export const getUserDto = (): TUserCreateInput => {
  return {
    login: 'newuser',
    password: 'userpassword',
    email: 'newUser@gmail.com',
  };
};
