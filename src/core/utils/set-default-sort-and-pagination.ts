import { paginationAndSortingDefault } from '../constants/paginationAndSort';
import { TPaginationAndSorting } from '../types/pagination-and-sorting';

export const setDefaultSortAndPaginationIfNotExist = <P = string>(
  query: Partial<TPaginationAndSorting<P>>,
): TPaginationAndSorting<P> => ({
  ...paginationAndSortingDefault,
  ...query,
  sortBy: (query.sortBy || paginationAndSortingDefault.sortBy) as P,
});
