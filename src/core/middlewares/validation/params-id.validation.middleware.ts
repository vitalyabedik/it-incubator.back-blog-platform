import { param } from 'express-validator';
import {
  EValidationParams,
  FIELD_REQUIRED_LENGTH,
} from '../../constants/validation';
import { paramsErrorMessages } from '../../constants/texts';

export const paramsIdValidationMiddleware = param(EValidationParams.Id)
  .exists()
  .withMessage(paramsErrorMessages.idRequired)
  .isString()
  .withMessage(paramsErrorMessages.idStringType)
  .isLength({ min: FIELD_REQUIRED_LENGTH })
  .withMessage(paramsErrorMessages.idMinLength);
