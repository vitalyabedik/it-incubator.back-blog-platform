import { WithId } from 'mongodb';
import { TUser } from '../../domain/user';

export type TUserQueryRepositoryOutput = WithId<TUser>;
