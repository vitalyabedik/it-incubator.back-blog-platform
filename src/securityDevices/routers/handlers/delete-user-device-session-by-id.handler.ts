import { Response } from 'express';
import { EHttpStatus } from '../../../core/constants/http';
import { TRequestWithParams } from '../../../core/types/request';
import { resultCodeToHttpException } from '../../../core/utils/resultCodeToHttpException';
import { EResultStatus } from '../../../core/constants/resultCode';
import { userDeviceSessionService } from '../../application/user-device-session.service';
import { TDeleteUserDeviceSessionParams } from './params/delete-user-device-session-params';

export const deleteDeviceSessionByIdHandler = async (
  req: TRequestWithParams<TDeleteUserDeviceSessionParams>,
  res: Response,
) => {
  const deviceId = req.params.id;
  const refreshToken = req.cookies.refreshToken;

  const result = await userDeviceSessionService.deleteUserSessionByDeviceId({
    deviceId,
    refreshToken,
  });

  if (result.status !== EResultStatus.Success) {
    return res
      .status(resultCodeToHttpException(result.status))
      .send({ errorsMessages: result.extensions });
  }

  res.sendStatus(EHttpStatus.NO_CONTENT_204);
};
