import { Router } from 'express';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';
import { routersPaths } from '../../core/constants/paths';
import { userInputDtoMiddleware } from '../../users/middlewares/user.input-dto.middleware';
import { getRateLimitMiddleware } from '../../logs/middlewares/rate-limit.middleware';
import { accessTokenMiddleware } from '../middlewares/access-token.guard-middleware';
import { authLoginInputDtoMiddleware } from '../middlewares/auth-login.input-dto.middleware';
import { authRegistrationConfirmationMiddleware } from '../middlewares/auth-registration-confirmation-user.middleware';
import { refreshTokenMiddleware } from '../middlewares/refresh-token.guard-middleware';
import { authRegistrationEmailResendingMiddleware } from '../middlewares/auth-registration-email-resending-user.middleware';
import { loginUserHandler } from './handlers/auth-login-user.handler';
import { getMeUserHandler } from './handlers/auth-get-me-user.handler';
import { registrationUserHandler } from './handlers/auth-register-user.handler';
import { registrationConfirmationUserHandler } from './handlers/auth-registration-confirmation-user.handler';
import { registrationEmailResendingUserHandler } from './handlers/auth-registration-email-resending-user.handler';
import { logoutUserHandler } from './handlers/auth-logout-user.handler';
import { refreshTokenHandler } from './handlers/auth-refresh-token.handler';

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
    getRateLimitMiddleware(),
    authLoginInputDtoMiddleware,
    inputValidationResultMiddleware,
    loginUserHandler,
  )
  .post(
    routersPaths.auth.logout,
    refreshTokenMiddleware,
    inputValidationResultMiddleware,
    logoutUserHandler,
  )
  .post(
    routersPaths.auth.refreshToken,
    refreshTokenMiddleware,
    inputValidationResultMiddleware,
    refreshTokenHandler,
  )
  .post(
    routersPaths.auth.registration,
    getRateLimitMiddleware(),
    userInputDtoMiddleware,
    inputValidationResultMiddleware,
    registrationUserHandler,
  )
  .post(
    routersPaths.auth.registrationConfirmation,
    getRateLimitMiddleware(),
    authRegistrationConfirmationMiddleware,
    inputValidationResultMiddleware,
    registrationConfirmationUserHandler,
  )
  .post(
    routersPaths.auth.registrationEmailResending,
    getRateLimitMiddleware(),
    authRegistrationEmailResendingMiddleware,
    inputValidationResultMiddleware,
    registrationEmailResendingUserHandler,
  );
