import { EBlogValidationField } from '../constants/errors';
import {
  BLOG_DESCRIPTION_MAX_FIELD_LENGTH,
  BLOG_NAME_MAX_FIELD_LENGTH,
  BLOG_WEBSITE_URL_MAX_FIELD_LENGTH,
  validationMessages,
} from '../constants/validation';
import { URL_REGEXP } from '../../core/constants/regExp';
import { validateBaseStringField } from '../../core/utils/validation';

const nameValidation = validateBaseStringField(EBlogValidationField.NAME, {
  texts: {
    typeMessage: validationMessages.nameType,
    lengthMessage: validationMessages.nameLength,
  },
  lengthRange: {
    max: BLOG_NAME_MAX_FIELD_LENGTH,
  },
});

const descriptionValidation = validateBaseStringField(
  EBlogValidationField.DESCRIPTION,
  {
    texts: {
      typeMessage: validationMessages.descriptionType,
      lengthMessage: validationMessages.descriptionLength,
    },
    lengthRange: {
      max: BLOG_DESCRIPTION_MAX_FIELD_LENGTH,
    },
  },
);

const websiteUrlValidation = validateBaseStringField(
  EBlogValidationField.WEBSITE_URL,
  {
    texts: {
      typeMessage: validationMessages.websiteUrlType,
      lengthMessage: validationMessages.websiteUrlLength,
    },
    lengthRange: {
      max: BLOG_WEBSITE_URL_MAX_FIELD_LENGTH,
    },
  },
)
  .isURL()
  .matches(URL_REGEXP)
  .withMessage(validationMessages.websiteUrlPattern);

export const blogInputDtoValidation = [
  nameValidation,
  descriptionValidation,
  websiteUrlValidation,
];
