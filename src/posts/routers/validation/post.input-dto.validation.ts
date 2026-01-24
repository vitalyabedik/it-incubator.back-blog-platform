import { EPostValidationField } from '../../constants/errors';
import {
  POST_CONTENT_MAX_FIELD_LENGTH,
  POST_SHORT_DESCRIPTION_MAX_FIELD_LENGTH,
  POST_TITLE_MAX_FIELD_LENGTH,
  validationMessages,
} from '../../constants/validation';
import {
  validateBaseISOStringDateField,
  validateBaseStringField,
} from '../../../core/utils/validation';

const titleValidation = validateBaseStringField(EPostValidationField.TITLE, {
  texts: {
    typeMessage: validationMessages.titleType,
    lengthMessage: validationMessages.titleLength,
  },
  lengthRange: {
    max: POST_TITLE_MAX_FIELD_LENGTH,
  },
});

const shortDescriptionValidation = validateBaseStringField(
  EPostValidationField.SHORT_DESCRIPTION,
  {
    texts: {
      typeMessage: validationMessages.shortDescriptionType,
      lengthMessage: validationMessages.shortDescriptionLength,
    },
    lengthRange: {
      max: POST_SHORT_DESCRIPTION_MAX_FIELD_LENGTH,
    },
  },
);

const contentValidation = validateBaseStringField(
  EPostValidationField.CONTENT,
  {
    texts: {
      typeMessage: validationMessages.contentType,
      lengthMessage: validationMessages.contentLength,
    },
    lengthRange: {
      max: POST_CONTENT_MAX_FIELD_LENGTH,
    },
  },
);

const blogIdValidation = validateBaseStringField(EPostValidationField.BLOG_ID, {
  texts: {
    typeMessage: validationMessages.blogIdType,
    lengthMessage: validationMessages.blogIdLength,
  },
});

const createdAtValidation = validateBaseISOStringDateField(
  EPostValidationField.CREATED_AT,
  {
    texts: {
      typeMessage: validationMessages.createdAtType,
    },
    optional: true,
  },
);

export const postInputDtoValidation = [
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  blogIdValidation,
  createdAtValidation,
];

export const postByBlogIdInputDtoValidation = [
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  createdAtValidation,
];
