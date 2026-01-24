import { TUserDB } from '../../domain/userDB';
import { TUserCreateInput } from '../../routes/input/user-create.input';

export const mapToDbUser = (
  userDto: TUserCreateInput,
  passwordHash: string,
): TUserDB => ({
  login: userDto.login,
  email: userDto.email,
  passwordHash,
  createdAt: new Date().toISOString(),
});
