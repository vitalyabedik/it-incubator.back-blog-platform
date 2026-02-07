import { Router } from 'express';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';
import { routersPaths } from '../../core/constants/paths';
import { userInputDtoMiddleware } from '../../users/middlewares/user.input-dto.middleware';
import { accessTokenMiddleware } from '../middlewares/access-token.guard-middleware';
import { authLoginInputDtoMiddleware } from '../middlewares/auth-login.input-dto.middleware';
import { authRegistrationConfirmationMiddleware } from '../middlewares/auth-registration-confirmation-user.middleware';
import { authRegistrationEmailResendingMiddleware } from '../middlewares/auth-registration-email-resending-user.middleware';
import { loginUserHandler } from './handlers/auth-login-user.handler';
import { getMeUserHandler } from './handlers/auth-get-me-user.handler';
import { registrationUserHandler } from './handlers/auth-register-user.handler';
import { registrationConfirmationUserHandler } from './handlers/auth-registration-confirmation-user.handler';
import { registrationEmailResendingUserHandler } from './handlers/auth-registration-email-resending-user.handler';

export const authRouter = Router({});

authRouter
  .get(
    routersPaths.auth.me,
    accessTokenMiddleware,
    inputValidationResultMiddleware,
    getMeUserHandler,
  )
  .post(
    routersPaths.auth.login,
    authLoginInputDtoMiddleware,
    inputValidationResultMiddleware,
    loginUserHandler,
  )
  .post(
    routersPaths.auth.registration,
    userInputDtoMiddleware,
    inputValidationResultMiddleware,
    registrationUserHandler,
  )
  .post(
    routersPaths.auth.registrationConfirmation,
    authRegistrationConfirmationMiddleware,
    inputValidationResultMiddleware,
    registrationConfirmationUserHandler,
  )
  .post(
    routersPaths.auth.registrationEmailResending,
    authRegistrationEmailResendingMiddleware,
    inputValidationResultMiddleware,
    registrationEmailResendingUserHandler,
  );
