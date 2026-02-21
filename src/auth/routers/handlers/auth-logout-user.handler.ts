import { Response } from 'express';
import { TRequestWithBody } from '../../../core/types/request';
import { userDeviceSessionService } from '../../../securityDevices/application/user-device-session.service';
import { TAuthLoginInput } from '../input/auth-login.input';
import { EHttpStatus } from '../../../core/constants/http';
import { routersPaths } from '../../../core/constants/paths';

export const logoutUserHandler = async (
  req: TRequestWithBody<TAuthLoginInput>,
  res: Response,
) => {
  const refreshToken = String(req.cookies.refreshToken);

  await userDeviceSessionService.deleteUserSessionByRefreshToken(refreshToken);

  res.clearCookie('refreshToken', { path: routersPaths.root });
  res.sendStatus(EHttpStatus.NO_CONTENT_204);
};
