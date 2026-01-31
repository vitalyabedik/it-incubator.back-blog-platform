import { param } from 'express-validator';

type TArgs = {
  parameter: string;
  options: {
    texts: {
      requiredMessage: string;
      stringTypeMessage: string;
      objectIdTypeMessage: string;
    };
  };
};

export const baseParamValidation = ({ parameter, options }: TArgs) => {
  const { texts } = options;

  return param(parameter)
    .exists()
    .withMessage(texts.requiredMessage)
    .isString()
    .withMessage(texts.stringTypeMessage)
    .isMongoId()
    .withMessage(texts.objectIdTypeMessage);
};
