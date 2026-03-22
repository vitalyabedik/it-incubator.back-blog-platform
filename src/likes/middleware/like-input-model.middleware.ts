import { body } from 'express-validator';
import { ELikeStatus } from '../constants/like-status';
import { paramsErrorMessages } from '../constants/texts';
import { ELikeValidationField } from '../constants/errors';
import { validationMessages } from '../constants/validation';

const allowedLikeStatuses = Object.values(ELikeStatus);

export const likeInputModelMiddleware = body(ELikeValidationField.LIKE_STATUS)
  .exists()
  .withMessage(paramsErrorMessages.likeRequired)
  .isIn(allowedLikeStatuses)
  .withMessage(validationMessages.incorrectLikeStatus);
