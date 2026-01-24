import { TBasePaginationOutput } from '../../../core/types/pagination-and-sorting';
import { TUserQueryRepositoryOutput } from './user-query-repository.output';

export type TUserListQueryRepositoryOutput =
  TBasePaginationOutput<TUserQueryRepositoryOutput>;
