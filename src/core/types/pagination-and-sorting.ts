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
  pageCount: number;
  totalCount: number;
};

export type TPaginationMeta = Omit<TPagination, 'pageCount'>;
