import { Router } from 'express';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';
import { routersPaths } from '../../core/constants/paths';
import { refreshTokenMiddleware } from '../../auth/middlewares/refresh-token.guard-middleware';
import { iocContainer } from '../../composition-root';
import { UserDeviceSessionController } from '../controller/user-device-session.controller';

const userDeviceSessionController = iocContainer.get(
  UserDeviceSessionController,
);

export const securityDevicesRouter = Router({});

securityDevicesRouter
  .get(
    routersPaths.security.devices,
    refreshTokenMiddleware,
    inputValidationResultMiddleware,
    userDeviceSessionController.getUserDeviceSessionList.bind(
      userDeviceSessionController,
    ),
  )
  .delete(
    routersPaths.security.devices,
    refreshTokenMiddleware,
    inputValidationResultMiddleware,
    userDeviceSessionController.deleteUserDeviceSessionList.bind(
      userDeviceSessionController,
    ),
  )
  .delete(
    `${routersPaths.security.devices}${routersPaths.byId}`,
    refreshTokenMiddleware,
    inputValidationResultMiddleware,
    userDeviceSessionController.deleteDeviceSessionByIdHandler.bind(
      userDeviceSessionController,
    ),
  );
