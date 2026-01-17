import { TPagination } from '../../../core/types/pagination-and-sorting';
import { TBlogOutput } from './blog.output';

export type TBlogListPaginatedOutput = TPagination & {
  items: TBlogOutput[];
};
