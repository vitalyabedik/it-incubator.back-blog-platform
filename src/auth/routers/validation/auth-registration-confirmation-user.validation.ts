import { FIELD_REQUIRED_LENGTH } from '../../../core/constants/validation';
import { validateBaseStringField } from '../../../core/utils/validation';
import { EAuthValidationField } from '../../constants/errors';
import { validationMessages } from '../../constants/validation';

const codeValidation = validateBaseStringField(EAuthValidationField.CODE, {
  texts: {
    typeMessage: validationMessages.codeType,
    lengthMessage: validationMessages.codeLength,
  },
  lengthRange: {
    min: FIELD_REQUIRED_LENGTH,
  },
});

export const authRegistrationConfirmationValidation = [codeValidation];
