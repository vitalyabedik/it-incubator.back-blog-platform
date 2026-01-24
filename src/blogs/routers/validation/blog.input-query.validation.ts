import { query } from 'express-validator';
import { filterErrorMessages } from '../../constants/texts';
import { EBlogValidationFilter } from '../../constants/validation';

export const blogInputFilterValidation = [
  query(EBlogValidationFilter.SEARCH_NAME_TERM)
    .optional()
    .isString()
    .withMessage(filterErrorMessages.searchNameTermType)
    .trim()
    .customSanitizer((value) => value || undefined),
];
