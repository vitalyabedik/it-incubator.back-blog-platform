import { TUser } from '../../domain/user';

export type TUserOutput = TUser & {
  id: string;
};
