import { Router } from 'express';
import { routersPaths } from '../../core/constants/paths';
import { superAdminGuardMiddleware } from '../../auth/middlewares/super-admin.guard-middleware';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';
import { paramsIdValidationMiddleware } from '../../core/middlewares/validation/params-id.validation.middleware';
import { userInputQueryMiddleware } from '../middlewares/user.input-query.middleware';
import { userInputDtoMiddleware } from '../middlewares/user.input-dto.middleware';
import { getUserListHandler } from './handlers/get-user-list.handler';
import { createUserHandler } from './handlers/create-user.handler';
import { deleteUserHandler } from './handlers/delete-user.handler';

export const usersRouter = Router({});

usersRouter
  .get(
    routersPaths.empty,
    superAdminGuardMiddleware,
    userInputQueryMiddleware,
    getUserListHandler,
  )
  .post(
    routersPaths.empty,
    superAdminGuardMiddleware,
    userInputDtoMiddleware,
    inputValidationResultMiddleware,
    createUserHandler,
  )
  .delete(
    routersPaths.byId,
    superAdminGuardMiddleware,
    paramsIdValidationMiddleware,
    inputValidationResultMiddleware,
    deleteUserHandler,
  );
