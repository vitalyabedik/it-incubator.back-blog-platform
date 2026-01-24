import { TPagination } from '../../../core/types/pagination-and-sorting';
import { TUserOutput } from './user.output';

export type TUserListPaginatedOutput = TPagination & {
  items: TUserOutput[];
};
