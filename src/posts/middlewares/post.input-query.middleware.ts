import { paginationAndSortingValidation } from '../../core/middlewares/validation/query-pagination-sorting.validation-middleware';
import { EPostSortField } from '../routers/input/post-sort-field.input';

export const postInputQueryMiddleware = [
  ...paginationAndSortingValidation(EPostSortField),
];
