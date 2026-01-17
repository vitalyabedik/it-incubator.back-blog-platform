import { TBasePaginationOutput } from '../../../core/types/pagination-and-sorting';
import { TPostRepositoryOutput } from './post-repository.output';

export type TPostListRepositoryOutput =
  TBasePaginationOutput<TPostRepositoryOutput>;
