import { authRegistrationConfirmationValidation } from '../routers/validation/auth-registration-confirmation-user.validation';

export const authRegistrationConfirmationMiddleware = [
  ...authRegistrationConfirmationValidation,
];
