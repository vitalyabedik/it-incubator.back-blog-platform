import { TPagination } from '../../../core/types/pagination-and-sorting';
import { TCommentOutput } from './comment.output';

export type TCommentListPaginatedOutput = TPagination & {
  items: TCommentOutput[];
};
