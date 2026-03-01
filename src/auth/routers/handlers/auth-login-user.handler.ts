import { Response } from 'express';
import { TRequestWithBody } from '../../../core/types/request';
import { EResultStatus } from '../../../core/constants/resultCode';
import { resultCodeToHttpException } from '../../../core/utils/resultCodeToHttpException';
import { getRequestIp } from '../../../core/utils/getRequestIp';
import { authService } from '../../application/auth.service';
import { TAuthLoginInput } from '../input/auth-login.input';

const UNKNOWN_DEVICE = 'неизвестное устройство';

export const loginUserHandler = async (
  req: TRequestWithBody<TAuthLoginInput>,
  res: Response,
) => {
  const deviceName = req.headers['user-agent'] || UNKNOWN_DEVICE;
  const ip = getRequestIp(req);

  const result = await authService.loginUser({
    ip,
    deviceName,
    loginDto: req.body,
  });

  if (result.status !== EResultStatus.Success) {
    return res
      .status(resultCodeToHttpException(result.status))
      .send({ errorsMessages: result.extensions });
  }

  res.cookie('refreshToken', result.data?.refreshToken, {
    httpOnly: true,
    secure: true,
  });
  res.send({ accessToken: result.data?.accessToken });
};
