import { paginationAndSortingValidation } from '../../core/middlewares/validation/query-pagination-sorting.validation-middleware';
import { EUserSortField } from '../routes/input/user-sort-field';
import { userInputFilterValidation } from '../routes/validation/user.input-query.validation';

export const userInputQueryMiddleware = [
  ...userInputFilterValidation,
  ...paginationAndSortingValidation(EUserSortField),
];
