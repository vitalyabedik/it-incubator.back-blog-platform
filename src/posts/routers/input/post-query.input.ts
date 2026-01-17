import { TPaginationAndSorting } from '../../../core/types/pagination-and-sorting';
import { EPostSortField } from './post-sort-field.input';

export type TPostQueryInput = TPaginationAndSorting<EPostSortField>;
