import { TPaginationAndSorting } from '../../../core/types/pagination-and-sorting';
import { EBlogSortField } from './blog-sort-field';

export type TBlogQueryInput = TPaginationAndSorting<EBlogSortField> &
  TBlogFilters;

export type TBlogFilters = Partial<{
  searchNameTerm: string;
}>;
