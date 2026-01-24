import { paginationAndSortingValidation } from '../../core/middlewares/validation/query-pagination-sorting.validation-middleware';
import { EBlogSortField } from '../routers/input/blog-sort-field';
import { blogInputFilterValidation } from '../routers/validation/blog.input-query.validation';

export const blogInputQueryMiddleware = [
  ...blogInputFilterValidation,
  ...paginationAndSortingValidation(EBlogSortField),
];
