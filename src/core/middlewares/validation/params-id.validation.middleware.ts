import { param } from 'express-validator';
import { EValidationParams } from '../../constants/validation';
import { paramsErrorMessages } from '../../constants/texts';

export const paramsIdValidationMiddleware = param(EValidationParams.ID)
  .exists()
  .withMessage(paramsErrorMessages.idRequired)
  .isString()
  .withMessage(paramsErrorMessages.idStringType)
  .isMongoId()
  .withMessage(paramsErrorMessages.idObjectIdType);
