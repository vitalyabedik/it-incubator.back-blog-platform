import { Sort } from 'mongodb';
import { TPaginationAndSorting } from '../types/pagination-and-sorting';
import { ESortDirection } from '../constants/paginationAndSort';

export const getPaginationParams = <S extends string>({
  pageNumber,
  pageSize,
  sortBy,
  sortDirection,
}: TPaginationAndSorting<S>) => {
  const sort: Sort = {
    [sortBy]: sortDirection === ESortDirection.ASC ? 1 : -1,
  };
  const skip = (pageNumber - 1) * pageSize;

  return {
    sort,
    skip,
    limit: pageSize,
  };
};
