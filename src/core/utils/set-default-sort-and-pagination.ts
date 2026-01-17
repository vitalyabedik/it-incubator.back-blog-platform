import { paginationAndSortingDefault } from '../constants/paginationAndSort';
import { TPaginationAndSorting } from '../types/pagination-and-sorting';

export const setDefaultSortAndPagination = <P = string>(
  query: Partial<TPaginationAndSorting<P>>,
): TPaginationAndSorting<P> => ({
  pageNumber: query.pageNumber || paginationAndSortingDefault.pageNumber,
  pageSize: query.pageSize || paginationAndSortingDefault.pageSize,
  sortBy: (query.sortBy || paginationAndSortingDefault.sortBy) as P,
  sortDirection:
    query.sortDirection || paginationAndSortingDefault.sortDirection,
});
