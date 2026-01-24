import { query } from 'express-validator';
import { filterErrorMessages } from '../../constants/texts';
import { EUserValidationFilter } from '../../constants/validation';

export const userInputFilterValidation = [
  query(EUserValidationFilter.SEARCH_LOGIN_TERM)
    .optional()
    .isString()
    .withMessage(filterErrorMessages.searchLoginTerm)
    .trim()
    .customSanitizer((value) => value || undefined),

  query(EUserValidationFilter.SEARCH_LOGIN_TERM)
    .optional()
    .isString()
    .withMessage(filterErrorMessages.searchEmailTerm)
    .trim()
    .customSanitizer((value) => value || undefined),
];
