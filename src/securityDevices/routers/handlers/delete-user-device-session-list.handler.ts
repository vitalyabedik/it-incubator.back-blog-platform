import { Request, Response } from 'express';
import { userDeviceSessionService } from '../../application/user-device-session.service';
import { EHttpStatus } from '../../../core/constants/http';

export const deleteUserDeviceSessionListHandler = async (
  req: Request,
  res: Response,
) => {
  const refreshToken = String(req.cookies.refreshToken);

  await userDeviceSessionService.deleteUserSessionsExceptTheCurrent(
    refreshToken,
  );

  res.sendStatus(EHttpStatus.NO_CONTENT_204);
};
