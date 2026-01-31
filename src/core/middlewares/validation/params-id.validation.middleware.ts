import { EValidationParams } from '../../constants/validation';
import { paramsErrorMessages } from '../../constants/texts';
import { baseParamValidation } from '../../utils/params-validation';

export const paramsIdValidationMiddleware = baseParamValidation({
  parameter: EValidationParams.ID,
  options: {
    texts: {
      requiredMessage: paramsErrorMessages.idRequired,
      stringTypeMessage: paramsErrorMessages.idStringType,
      objectIdTypeMessage: paramsErrorMessages.idObjectIdType,
    },
  },
});

export const paramsBlogIdValidationMiddleware = baseParamValidation({
  parameter: EValidationParams.BLOG_ID,
  options: {
    texts: {
      requiredMessage: paramsErrorMessages.blogIdRequired,
      stringTypeMessage: paramsErrorMessages.blogIdStringType,
      objectIdTypeMessage: paramsErrorMessages.blogIdObjectIdType,
    },
  },
});

export const paramsPostIdValidationMiddleware = baseParamValidation({
  parameter: EValidationParams.POST_ID,
  options: {
    texts: {
      requiredMessage: paramsErrorMessages.postIdRequired,
      stringTypeMessage: paramsErrorMessages.postIdStringType,
      objectIdTypeMessage: paramsErrorMessages.postIdObjectIdType,
    },
  },
});

export const paramsCommentIdValidationMiddleware = baseParamValidation({
  parameter: EValidationParams.COMMENT_ID,
  options: {
    texts: {
      requiredMessage: paramsErrorMessages.commentIdRequired,
      stringTypeMessage: paramsErrorMessages.commentIdStringType,
      objectIdTypeMessage: paramsErrorMessages.commentIdObjectIdType,
    },
  },
});
