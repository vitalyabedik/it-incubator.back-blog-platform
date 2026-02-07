import { EMAIL_REGEXP } from '../../../core/constants/regExp';
import { FIELD_REQUIRED_LENGTH } from '../../../core/constants/validation';
import { validateBaseStringField } from '../../../core/utils/validation';
import { EAuthValidationField } from '../../constants/errors';
import { validationMessages } from '../../constants/validation';

const emailValidation = validateBaseStringField(EAuthValidationField.EMAIL, {
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

export const authRegistrationEmailResendingValidation = [emailValidation];
