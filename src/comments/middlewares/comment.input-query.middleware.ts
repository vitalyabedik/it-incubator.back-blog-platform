import { paginationAndSortingValidation } from '../../core/middlewares/validation/query-pagination-sorting.validation-middleware';
import { ECommentSortField } from '../routers/input/comment-sort-field';

export const commentInputQueryMiddleware = [
  ...paginationAndSortingValidation(ECommentSortField),
];
