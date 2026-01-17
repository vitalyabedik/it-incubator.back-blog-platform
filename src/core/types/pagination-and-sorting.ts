import { ESortDirection } from '../constants/paginationAndSort';

export type TPaginationAndSorting<S> = {
  pageNumber: number;
  pageSize: number;
  sortBy: S;
  sortDirection: ESortDirection;
};

export type TPagination = {
  page: number;
  pageSize: number;
  pagesCount: number;
  totalCount: number;
};

export type TPaginationMeta = Omit<TPagination, 'pagesCount'>;

export type TBasePaginationOutput<T> = {
  items: T[];
  totalCount: number;
};
