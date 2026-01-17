import { TFilters } from '../../blogs/routers/input/blog-query.input';
import { paginationAndSortingDefault } from '../constants/paginationAndSort';

export const setDefaultFilters = (query: TFilters): TFilters => ({
  searchNameTerm:
    query.searchNameTerm || paginationAndSortingDefault.sortDirection,
});
