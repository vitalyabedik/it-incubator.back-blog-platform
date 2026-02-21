import { Response } from 'express';
import { TRequestWithBody } from '../../../core/types/request';
import { TUserCreateInput } from '../../../users/routes/input/user-create.input';
import { EResultStatus } from '../../../core/constants/resultCode';
import { resultCodeToHttpException } from '../../../core/utils/resultCodeToHttpException';
import { EHttpStatus } from '../../../core/constants/http';
import { authService } from '../../application/auth.service';

export const registrationUserHandler = async (
  req: TRequestWithBody<TUserCreateInput>,
  res: Response,
) => {
  const result = await authService.registerUser(req.body);

  if (result.status !== EResultStatus.Success) {
    return res
      .sendStatus(resultCodeToHttpException(result.status))
      .send({ errorsMessages: result.extensions });
  }

  res.sendStatus(EHttpStatus.NO_CONTENT_204);
};
