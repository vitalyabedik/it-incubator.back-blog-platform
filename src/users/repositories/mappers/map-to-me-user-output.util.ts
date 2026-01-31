import { TUserMeOutput } from '../output/user-me.output';
import { TUserQueryRepositoryOutput } from '../output/user-query-repository.output';

export const mapToMeUserOutput = (
  userQueryRepoOutput: TUserQueryRepositoryOutput,
): TUserMeOutput => ({
  userId: userQueryRepoOutput._id.toString(),
  login: userQueryRepoOutput.login,
  email: userQueryRepoOutput.email,
});
