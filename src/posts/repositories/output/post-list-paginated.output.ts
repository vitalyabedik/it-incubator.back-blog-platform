import { TPagination } from '../../../core/types/pagination-and-sorting';
import { TPostOutput } from './post.output';

export type TPostListPaginatedOutput = TPagination & {
  items: TPostOutput[];
};
