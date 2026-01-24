import { TBasePaginationOutput } from '../../../core/types/pagination-and-sorting';
import { TPostQueryRepositoryOutput } from './post-query-repository.output';

export type TPostListQueryRepositoryOutput =
  TBasePaginationOutput<TPostQueryRepositoryOutput>;
