import { Response } from 'express';
import { TRequestWithBody } from '../../../core/types/request';
import { EResultStatus } from '../../../core/constants/resultCode';
import { resultCodeToHttpException } from '../../../core/utils/resultCodeToHttpException';
import { authService } from '../../application/auth.service';
import { TAuthLogoutInput } from '../input/auth-logout.input';
import { EHttpStatus } from '../../../core/constants/http';

export const logoutUserHandler = async (
  req: TRequestWithBody<TAuthLogoutInput>,
  res: Response,
) => {
  const refreshToken = String(req.cookies.refreshToken);

  const result = await authService.logoutUser({ refreshToken });

  if (result.status !== EResultStatus.Success) {
    return res.sendStatus(resultCodeToHttpException(result.status));
  }

  res.sendStatus(EHttpStatus.NO_CONTENT_204);
};
