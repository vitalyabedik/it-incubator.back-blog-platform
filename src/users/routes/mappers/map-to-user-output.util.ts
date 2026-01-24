import { TUserQueryRepositoryOutput } from '../../repositories/output/user-query-repository.output';
import { TUserOutput } from '../output/user.output';

export const mapToUserOutput = (
  user: TUserQueryRepositoryOutput,
): TUserOutput => ({
  id: user._id.toString(),
  login: user.login,
  email: user.email,
  createdAt: user.createdAt,
});
