import { defaultBlogFilters } from '../../../constants/filters';
import { TBlogFilters } from '../../input/blog-query.input';

export const setDefaultBlogFilters = (filters: TBlogFilters): TBlogFilters => ({
  searchNameTerm: filters.searchNameTerm || defaultBlogFilters.searchNameTerm,
});
