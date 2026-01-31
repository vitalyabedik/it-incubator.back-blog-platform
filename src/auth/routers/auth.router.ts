import { Router } from 'express';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';
import { routersPaths } from '../../core/constants/paths';
import { accessTokenMiddleware } from '../middlewares/access-token.guard-middleware';
import { loginUserHandler } from './handlers/auth-login-user.handler';
import { getMeUserHandler } from './handlers/auth-get-me-user.handler';
import { authLoginInputDtoValidation } from './validation/auth-login.input-dto.validation-middlewares';

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
    authLoginInputDtoValidation,
    inputValidationResultMiddleware,
    loginUserHandler,
  );
