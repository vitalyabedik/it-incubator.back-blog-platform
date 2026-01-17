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

export const paramsBlogIdValidationMiddleware = param(EValidationParams.BLOG_ID)
  .exists()
  .withMessage(paramsErrorMessages.blogIdRequired)
  .isString()
  .withMessage(paramsErrorMessages.blogIdStringType)
  .isMongoId()
  .withMessage(paramsErrorMessages.blogIdObjectIdType);
