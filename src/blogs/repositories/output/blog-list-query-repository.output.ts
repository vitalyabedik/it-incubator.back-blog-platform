import { TBasePaginationOutput } from '../../../core/types/pagination-and-sorting';
import { TBlogQueryRepositoryOutput } from './blog-query-repository.output';

export type TBlogListQueryRepositoryOutput =
  TBasePaginationOutput<TBlogQueryRepositoryOutput>;
