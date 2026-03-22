import { TUserMapInput } from '../../model/user.model';
import { TUserOutput } from '../output/user.output';

export const mapToUserOutput = (user: TUserMapInput): TUserOutput => ({
  id: user._id.toString(),
  login: user.login,
  email: user.email,
  createdAt: user.createdAt.toISOString(),
});
