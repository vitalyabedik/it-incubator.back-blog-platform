import { WithId } from 'mongodb';
import { TComment } from '../../domain/comment';

export type TCommentQueryRepositoryOutput = WithId<TComment>;
