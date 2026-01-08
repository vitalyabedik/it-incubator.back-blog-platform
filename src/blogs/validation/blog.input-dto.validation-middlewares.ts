import { body } from 'express-validator';
import { EBlogValidationField } from '../constants/errors';
import {
  BLOG_DESCRIPTION_MAX_FIELD_LENGTH,
  BLOG_NAME_MAX_FIELD_LENGTH,
  BLOG_WEBSITE_URL_MAX_FIELD_LENGTH,
  validationMessages,
} from '../constants/validation';
import { FIELD_REQUIRED_LENGTH } from '../../core/constants/validation';
import { URL_REGEXP } from '../../core/constants/regExp';

const nameValidation = body(EBlogValidationField.Name)
  .isString()
  .withMessage(validationMessages.nameType)
  .trim()
  .isLength({ min: FIELD_REQUIRED_LENGTH, max: BLOG_NAME_MAX_FIELD_LENGTH })
  .withMessage(validationMessages.nameLength);

const descriptionValidation = body(EBlogValidationField.Description)
  .isString()
  .withMessage(validationMessages.descriptionType)
  .trim()
  .isLength({
    min: FIELD_REQUIRED_LENGTH,
    max: BLOG_DESCRIPTION_MAX_FIELD_LENGTH,
  })
  .withMessage(validationMessages.descriptionLength);

const websiteUrlValidation = body(EBlogValidationField.WebsiteUrl)
  .isString()
  .withMessage(validationMessages.websiteUrlType)
  .trim()
  .isLength({
    min: FIELD_REQUIRED_LENGTH,
    max: BLOG_WEBSITE_URL_MAX_FIELD_LENGTH,
  })
  .withMessage(validationMessages.websiteUrlLength)
  .isURL()
  .matches(URL_REGEXP)
  .withMessage(validationMessages.websiteUrlPattern);

export const blogInputDtoValidation = [
  nameValidation,
  descriptionValidation,
  websiteUrlValidation,
];
