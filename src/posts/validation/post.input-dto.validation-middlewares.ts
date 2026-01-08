import { body } from 'express-validator';
import { EPostValidationField } from '../constants/errors';
import { FIELD_REQUIRED_LENGTH } from '../../core/constants/validation';
import {
  POST_CONTENT_MAX_FIELD_LENGTH,
  POST_SHORT_DESCRIPTION_MAX_FIELD_LENGTH,
  POST_TITLE_MAX_FIELD_LENGTH,
  validationMessages,
} from '../constants/validation';

const titleValidation = body(EPostValidationField.Title)
  .isString()
  .withMessage(validationMessages.titleType)
  .trim()
  .isLength({ min: FIELD_REQUIRED_LENGTH, max: POST_TITLE_MAX_FIELD_LENGTH })
  .withMessage(validationMessages.titleLength);

const shortDescriptionValidation = body(EPostValidationField.ShortDescription)
  .isString()
  .withMessage(validationMessages.shortDescriptionType)
  .trim()
  .isLength({
    min: FIELD_REQUIRED_LENGTH,
    max: POST_SHORT_DESCRIPTION_MAX_FIELD_LENGTH,
  })
  .withMessage(validationMessages.shortDescriptionType);

const contentValidation = body(EPostValidationField.Content)
  .isString()
  .withMessage(validationMessages.contentType)
  .trim()
  .isLength({
    min: FIELD_REQUIRED_LENGTH,
    max: POST_CONTENT_MAX_FIELD_LENGTH,
  })
  .withMessage(validationMessages.contentLength);

const blogIdValidation = body(EPostValidationField.BlogId)
  .isString()
  .withMessage(validationMessages.blogIdType)
  .trim()
  .isLength({
    min: FIELD_REQUIRED_LENGTH,
  })
  .withMessage(validationMessages.blogIdLength);

export const postInputDtoValidation = [
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  blogIdValidation,
];
