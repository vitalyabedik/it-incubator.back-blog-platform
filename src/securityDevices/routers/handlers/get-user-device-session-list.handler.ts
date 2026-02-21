import { Request, Response } from 'express';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { jwtService } from '../../../auth/adapters/jwt.service';
import { userDeviceSessionQueryRepository } from '../../repositories/user-device-session-query.repositories';

export const getUserDeviceSessionListHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const refreshToken = String(req.cookies.refreshToken);
    const decodedRefreshToken =
      await jwtService.decodeRefreshToken(refreshToken);

    const userDeviceSessionListOutput =
      await userDeviceSessionQueryRepository.getUserDeviceSessionListByUserId(
        decodedRefreshToken!.userId,
      );

    res.send(userDeviceSessionListOutput);
  } catch (error: unknown) {
    errorsHandler(error, res);
  }
};
