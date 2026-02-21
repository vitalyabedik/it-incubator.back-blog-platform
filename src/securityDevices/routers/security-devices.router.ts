import { Router } from 'express';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';
import { routersPaths } from '../../core/constants/paths';
import { refreshTokenMiddleware } from '../../auth/middlewares/refresh-token.guard-middleware';
import { getUserDeviceSessionListHandler } from './handlers/get-user-device-session-list.handler';
import { deleteUserDeviceSessionListHandler } from './handlers/delete-user-device-session-list.handler';
import { deleteDeviceSessionByIdHandler } from './handlers/delete-user-device-session-by-id.handler';

export const securityDevicesRouter = Router({});

securityDevicesRouter
  .get(
    routersPaths.security.devices,
    refreshTokenMiddleware,
    inputValidationResultMiddleware,
    getUserDeviceSessionListHandler,
  )
  .delete(
    routersPaths.security.devices,
    refreshTokenMiddleware,
    inputValidationResultMiddleware,
    deleteUserDeviceSessionListHandler,
  )
  .delete(
    `${routersPaths.security.devices}${routersPaths.byId}`,
    refreshTokenMiddleware,
    inputValidationResultMiddleware,
    deleteDeviceSessionByIdHandler,
  );
