import { TBasePaginationOutput } from '../../../core/types/pagination-and-sorting';
import { TBlogRepositoryOutput } from './blog-repository.output';

export type TBlogListRepositoryOutput =
  TBasePaginationOutput<TBlogRepositoryOutput>;
