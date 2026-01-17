import { TPaginationAndSorting } from '../types/pagination-and-sorting';

export enum ESortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SORT_DIRECTION = ESortDirection.ASC;
const DEFAULT_SORT_BY = 'createdAt';

export const paginationAndSortingDefault: TPaginationAndSorting<string> = {
  pageNumber: DEFAULT_PAGE_NUMBER,
  pageSize: DEFAULT_PAGE_SIZE,
  sortBy: DEFAULT_SORT_BY,
  sortDirection: DEFAULT_SORT_DIRECTION,
};

export const MAX_PAGE_SIZE = 100;
