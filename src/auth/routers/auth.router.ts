import { Router } from 'express';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';
import { routersPaths } from '../../core/constants/paths';
import { loginUserHandler } from './handlers/auth-login-user.handler';
import { authLoginInputDtoValidation } from './validation/auth-login.input-dto.validation-middlewares';

export const authRouter = Router({});

authRouter.post(
  routersPaths.auth.login,
  authLoginInputDtoValidation,
  inputValidationResultMiddleware,
  loginUserHandler,
);
