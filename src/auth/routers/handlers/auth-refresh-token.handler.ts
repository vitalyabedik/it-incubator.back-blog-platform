import { Response } from 'express';
import { TRequestWithBody } from '../../../core/types/request';
import { EResultStatus } from '../../../core/constants/resultCode';
import { resultCodeToHttpException } from '../../../core/utils/resultCodeToHttpException';
import { getRequestIp } from '../../../core/utils/getRequestIp';
import { authService } from '../../application/auth.service';
import { TAuthRefreshTokenInput } from '../input/auth-refresh-token.input';

export const refreshTokenHandler = async (
  req: TRequestWithBody<TAuthRefreshTokenInput>,
  res: Response,
) => {
  const refreshToken = String(req.cookies.refreshToken);
  const ip = getRequestIp(req);

  const result = await authService.refreshToken({ ip, refreshToken });

  if (result.status !== EResultStatus.Success) {
    return res
      .sendStatus(resultCodeToHttpException(result.status))
      .send({ errorsMessages: result.extensions });
  }

  res.cookie('refreshToken', result.data?.refreshToken, {
    httpOnly: true,
    secure: true,
  });
  res.send({ accessToken: result.data?.accessToken });
};
