import { EAuthValidationField } from '../../constants/errors';
import { validationMessages } from '../../constants/validation';
import { validateBaseStringField } from '../../../core/utils/validation';
import { FIELD_REQUIRED_LENGTH } from '../../../core/constants/validation';
import {
  USER_PASSWORD_MAX_FIELD_LENGTH,
  USER_PASSWORD_MIN_FIELD_LENGTH,
} from '../../../users/constants/validation';

const newPasswordValidation = validateBaseStringField(
  EAuthValidationField.NEW_PASSWORD,
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

const recoveryCodeValidation = validateBaseStringField(
  EAuthValidationField.RECOVERY_CODE,
  {
    texts: {
      typeMessage: validationMessages.codeType,
      lengthMessage: validationMessages.codeLength,
    },
    lengthRange: {
      min: FIELD_REQUIRED_LENGTH,
    },
  },
);

export const authNewPasswordInputDtoValidation = [
  newPasswordValidation,
  recoveryCodeValidation,
];
