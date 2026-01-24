import { defaultUserFilters } from '../../../constants/filters';
import { TUserFilters } from '../../input/user-query.input';

export const setDefaultUserFilters = (filters: TUserFilters): TUserFilters => ({
  searchLoginTerm:
    filters.searchLoginTerm || defaultUserFilters.searchLoginTerm,
  searchEmailTerm:
    filters.searchEmailTerm || defaultUserFilters.searchEmailTerm,
});
