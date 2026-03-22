import { TUserMapInput } from '../../model/user.model';
import { TUserMeOutput } from '../output/user-me.output';

export const mapToMeUserOutput = (
  userQueryRepoOutput: TUserMapInput,
): TUserMeOutput => ({
  userId: userQueryRepoOutput._id.toString(),
  login: userQueryRepoOutput.login,
  email: userQueryRepoOutput.email,
});
