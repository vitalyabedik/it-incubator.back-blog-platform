import { WithId } from 'mongodb';
import { TUserDB } from '../../domain/userDB';

export type TUserRepositoryOutput = WithId<TUserDB>;
