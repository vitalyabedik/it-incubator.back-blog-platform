import { ECommentValidationField } from '../../constants/errors';
import {
  COMMENT_CONTENT_MAX_FIELD_LENGTH,
  COMMENT_CONTENT_MIN_FIELD_LENGTH,
  validationMessages,
} from '../../constants/validation';
import {
  validateBaseISOStringDateField,
  validateBaseStringField,
} from '../../../core/utils/validation';

const contentValidation = validateBaseStringField(
  ECommentValidationField.CONTENT,
  {
    texts: {
      typeMessage: validationMessages.contentType,
      lengthMessage: validationMessages.contentLength,
    },
    lengthRange: {
      min: COMMENT_CONTENT_MIN_FIELD_LENGTH,
      max: COMMENT_CONTENT_MAX_FIELD_LENGTH,
    },
  },
);

const createdAtValidation = validateBaseISOStringDateField(
  ECommentValidationField.CREATED_AT,
  {
    texts: {
      typeMessage: validationMessages.createdAtType,
    },
    optional: true,
  },
);

export const commentInputDtoValidation = [
  contentValidation,
  createdAtValidation,
];
