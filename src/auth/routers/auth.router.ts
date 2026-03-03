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
import { authPasswordRecoveryInputDtoMiddleware } from '../middlewares/auth-password-recovery.input-dto.middleware';
import { authNewPasswordInputDtoMiddleware } from '../middlewares/auth-new-password.input-dto.middleware';
import { iocContainer } from '../../composition-root';
import { AuthController } from '../controller/auth.controller';

const authController = iocContainer.get(AuthController);

export const authRouter = Router({});

authRouter
  .get(
    routersPaths.auth.me,
    accessTokenMiddleware,
    inputValidationResultMiddleware,
    authController.getMe.bind(authController),
  )
  .post(
    routersPaths.auth.login,
    getRateLimitMiddleware(),
    authLoginInputDtoMiddleware,
    inputValidationResultMiddleware,
    authController.login.bind(authController),
  )
  .post(
    routersPaths.auth.logout,
    refreshTokenMiddleware,
    inputValidationResultMiddleware,
    authController.logout.bind(authController),
  )
  .post(
    routersPaths.auth.refreshToken,
    refreshTokenMiddleware,
    inputValidationResultMiddleware,
    authController.refreshToken.bind(authController),
  )
  .post(
    routersPaths.auth.registration,
    getRateLimitMiddleware(),
    userInputDtoMiddleware,
    inputValidationResultMiddleware,
    authController.registration.bind(authController),
  )
  .post(
    routersPaths.auth.registrationConfirmation,
    getRateLimitMiddleware(),
    authRegistrationConfirmationMiddleware,
    inputValidationResultMiddleware,
    authController.registrationConfirmation.bind(authController),
  )
  .post(
    routersPaths.auth.registrationEmailResending,
    getRateLimitMiddleware(),
    authRegistrationEmailResendingMiddleware,
    inputValidationResultMiddleware,
    authController.registrationEmailResending.bind(authController),
  )
  .post(
    routersPaths.auth.passwordRecovery,
    getRateLimitMiddleware(),
    authPasswordRecoveryInputDtoMiddleware,
    inputValidationResultMiddleware,
    authController.passwordRecovery.bind(authController),
  )
  .post(
    routersPaths.auth.newPassword,
    getRateLimitMiddleware(),
    authNewPasswordInputDtoMiddleware,
    inputValidationResultMiddleware,
    authController.newPassword.bind(authController),
  );
