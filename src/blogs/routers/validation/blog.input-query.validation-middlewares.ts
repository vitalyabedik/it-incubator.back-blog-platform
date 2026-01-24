import { query } from 'express-validator';
import { paginationAndSortingValidation } from '../../../core/middlewares/validation/query-pagination-sorting.validation-middleware';
import { filterErrorMessages } from '../../constants/texts';
import { EBlogValidationFilter } from '../../constants/validation';
import { EBlogSortField } from '../input/blog-sort-field';

const blogInputFilterMiddleware = [
  query(EBlogValidationFilter.SEARCH_NAME_TERM)
    .optional()
    .isString()
    .withMessage(filterErrorMessages.searchNameTermType)
    .trim()
    .customSanitizer((value) => value || undefined),
];

export const blogInputQueryMiddleware = [
  ...blogInputFilterMiddleware,
  ...paginationAndSortingValidation(EBlogSortField),
];
