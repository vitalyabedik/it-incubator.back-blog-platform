import { authNewPasswordInputDtoValidation } from '../routers/validation/auth-new-password.input-dto.validation';

export const authNewPasswordInputDtoMiddleware = [
  ...authNewPasswordInputDtoValidation,
];
