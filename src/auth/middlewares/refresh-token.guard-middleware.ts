import { NextFunction, Request, Response } from 'express';
import { EHttpStatus } from '../../core/constants/http';
import { JWTService } from '../adapters/jwt.service';
import { UserDeviceSessionRepository } from '../../securityDevices/repositories/user-device-session.repositories';
import { iocContainer } from '../../composition-root';

const jwtService = iocContainer.get(JWTService);
const userDeviceSessionRepository = iocContainer.get(
  UserDeviceSessionRepository,
);

export const refreshTokenMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const refreshToken = String(req.cookies.refreshToken);
  if (!refreshToken) return res.sendStatus(EHttpStatus.UNAUTHORIZED_401);

  const result = await jwtService.verifyRefreshToken(refreshToken);
  if (!result) return res.sendStatus(EHttpStatus.UNAUTHORIZED_401);

  const tokenSession =
    await userDeviceSessionRepository.getUserDeviceSessionByFilter({
      deviceId: result.deviceId,
    });

  if (!tokenSession || tokenSession.iat !== result.iat)
    return res.sendStatus(EHttpStatus.UNAUTHORIZED_401);

  next();
};
