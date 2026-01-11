import { body } from 'express-validator';
import { FIELD_REQUIRED_LENGTH } from '../constants/validation';

export const validateBaseStringField = (
  field: string,
  options: {
    texts: {
      typeMessage: string;
      lengthMessage: string;
    };
    lengthRange?: {
      min?: number;
      max?: number;
    };
  },
) => {
  const { texts, lengthRange } = options;

  return body(field)
    .isString()
    .withMessage(texts.typeMessage)
    .trim()
    .isLength({
      min: lengthRange?.min || FIELD_REQUIRED_LENGTH,
      ...(lengthRange?.max && { max: lengthRange.max }),
    })
    .withMessage(texts.lengthMessage);
};

export const validateBaseISOStringDateField = (
  field: string,
  options: {
    texts: {
      typeMessage: string;
    };
    optional?: boolean;
  },
) => {
  const { optional = false, texts } = options;
  const validator = body(field);

  if (!optional) return validator.isISO8601().withMessage(texts.typeMessage);

  return validator.optional().isISO8601().withMessage(texts.typeMessage);
};
