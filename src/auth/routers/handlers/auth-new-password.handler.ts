import { Response } from 'express';
import { TRequestWithBody } from '../../../core/types/request';
import { EHttpStatus } from '../../../core/constants/http';
import { resultCodeToHttpException } from '../../../core/utils/resultCodeToHttpException';
import { EResultStatus } from '../../../core/constants/resultCode';
import { authService } from '../../application/auth.service';
import { TAuthNewPasswordInput } from '../input/auth-new-password.input';

export const newPasswordHandler = async (
  req: TRequestWithBody<TAuthNewPasswordInput>,
  res: Response,
) => {
  const result = await authService.createNewPassword(req.body);

  if (result.status !== EResultStatus.Success) {
    return res
      .status(resultCodeToHttpException(result.status))
      .send({ errorsMessages: result.extensions });
  }

  res.sendStatus(EHttpStatus.NO_CONTENT_204);
};
