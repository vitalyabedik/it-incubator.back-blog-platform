import { EAuthValidationField } from '../../constants/errors';
import { validationMessages } from '../../constants/validation';
import { validateBaseStringField } from '../../../core/utils/validation';
import { FIELD_REQUIRED_LENGTH } from '../../../core/constants/validation';

const loginOrEmailValidation = validateBaseStringField(
  EAuthValidationField.LOGIN_OR_EMAIL,
  {
    texts: {
      typeMessage: validationMessages.loginOrEmailType,
      lengthMessage: validationMessages.loginOrEmailLength,
    },
    lengthRange: {
      min: FIELD_REQUIRED_LENGTH,
    },
  },
);

const passwordValidation = validateBaseStringField(
  EAuthValidationField.PASSWORD,
  {
    texts: {
      typeMessage: validationMessages.passwordType,
      lengthMessage: validationMessages.passwordLength,
    },
    lengthRange: {
      min: FIELD_REQUIRED_LENGTH,
    },
  },
);

export const authLoginInputDtoValidation = [
  loginOrEmailValidation,
  passwordValidation,
];
