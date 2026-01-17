import { TFilters } from '../../blogs/routers/input/blog-query.input';
import { defaultFilters } from '../constants/filters';

export const setDefaultFilters = (query: TFilters): TFilters => ({
  searchNameTerm: query.searchNameTerm || defaultFilters.searchNameTerm,
});
