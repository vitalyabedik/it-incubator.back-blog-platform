import { TPaginationAndSorting } from '../../../core/types/pagination-and-sorting';
import { EUserSortField } from './user-sort-field';

export type TUserQueryInput = TPaginationAndSorting<EUserSortField> &
  TUserFilters;

export type TUserFilters = Partial<{
  searchLoginTerm: string;
  searchEmailTerm: string;
}>;
