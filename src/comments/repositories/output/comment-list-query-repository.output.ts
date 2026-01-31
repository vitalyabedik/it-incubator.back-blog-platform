import { TBasePaginationOutput } from '../../../core/types/pagination-and-sorting';
import { TCommentQueryRepositoryOutput } from './comment-query-repository.output';

export type TCommentListQueryRepositoryOutput =
  TBasePaginationOutput<TCommentQueryRepositoryOutput>;
