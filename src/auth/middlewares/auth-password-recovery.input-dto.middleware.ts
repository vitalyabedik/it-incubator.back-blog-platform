import { authRegistrationEmailResendingValidation } from '../routers/validation/auth-registration-email-resending-user.validation';

export const authPasswordRecoveryInputDtoMiddleware = [
  ...authRegistrationEmailResendingValidation,
];
