import { WithId } from 'mongodb';
import { TPost } from '../../domain/post';

export type TPostRepositoryOutput = WithId<TPost>;
