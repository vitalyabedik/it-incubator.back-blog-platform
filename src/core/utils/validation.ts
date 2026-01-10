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
) =>
  body(field)
    .isString()
    .withMessage(options.texts.typeMessage)
    .trim()
    .isLength({
      min: options.lengthRange?.min || FIELD_REQUIRED_LENGTH,
      ...(options.lengthRange?.max && { max: options.lengthRange.max }),
    })
    .withMessage(options.texts.lengthMessage);
