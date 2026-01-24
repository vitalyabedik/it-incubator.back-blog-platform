import { EUserValidationField } from '../../constants/errors';
import {
  USER_LOGIN_MAX_FIELD_LENGTH,
  USER_LOGIN_MIN_FIELD_LENGTH,
  USER_PASSWORD_MAX_FIELD_LENGTH,
  USER_PASSWORD_MIN_FIELD_LENGTH,
  validationMessages,
} from '../../constants/validation';
import { EMAIL_REGEXP, LOGIN_REGEXP } from '../../../core/constants/regExp';
import { validateBaseStringField } from '../../../core/utils/validation';
import { FIELD_REQUIRED_LENGTH } from '../../../core/constants/validation';

const loginValidation = validateBaseStringField(EUserValidationField.LOGIN, {
  texts: {
    typeMessage: validationMessages.loginType,
    lengthMessage: validationMessages.loginLength,
  },
  lengthRange: {
    min: USER_LOGIN_MIN_FIELD_LENGTH,
    max: USER_LOGIN_MAX_FIELD_LENGTH,
  },
})
  .matches(LOGIN_REGEXP)
  .withMessage(validationMessages.loginPattern);

const passwordValidation = validateBaseStringField(
  EUserValidationField.PASSWORD,
  {
    texts: {
      typeMessage: validationMessages.passwordType,
      lengthMessage: validationMessages.passwordLength,
    },
    lengthRange: {
      min: USER_PASSWORD_MIN_FIELD_LENGTH,
      max: USER_PASSWORD_MAX_FIELD_LENGTH,
    },
  },
);

const emailValidation = validateBaseStringField(EUserValidationField.EMAIL, {
  texts: {
    typeMessage: validationMessages.emailType,
    lengthMessage: validationMessages.emailLength,
  },
  lengthRange: {
    min: FIELD_REQUIRED_LENGTH,
  },
})
  .matches(EMAIL_REGEXP)
  .withMessage(validationMessages.emailPattern);

export const userInputDtoValidation = [
  loginValidation,
  passwordValidation,
  emailValidation,
];
