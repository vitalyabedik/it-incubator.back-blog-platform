import { Router } from 'express';
import { routersPaths } from '../../core/constants/paths';
import { superAdminGuardMiddleware } from '../../auth/middlewares/super-admin.guard-middleware';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';
import { paramsIdValidationMiddleware } from '../../core/middlewares/validation/params-id.validation.middleware';
import { userInputQueryMiddleware } from '../middlewares/user.input-query.middleware';
import { userInputDtoMiddleware } from '../middlewares/user.input-dto.middleware';
import { UsersController } from '../controller/users.controller';
import { iocContainer } from '../../composition-root';

const usersController = iocContainer.get(UsersController);

export const usersRouter = Router({});

usersRouter
  .get(
    routersPaths.empty,
    superAdminGuardMiddleware,
    userInputQueryMiddleware,
    usersController.getUserList.bind(usersController),
  )
  .post(
    routersPaths.empty,
    superAdminGuardMiddleware,
    userInputDtoMiddleware,
    inputValidationResultMiddleware,
    usersController.createUser.bind(usersController),
  )
  .delete(
    routersPaths.byId,
    superAdminGuardMiddleware,
    paramsIdValidationMiddleware,
    inputValidationResultMiddleware,
    usersController.deleteUser.bind(usersController),
  );
