import { Response } from 'express';
import { EHttpStatus } from '../../../core/constants/http';
import { EResultStatus } from '../../../core/constants/resultCode';
import { TRequestWithBody } from '../../../core/types/request';
import { resultCodeToHttpException } from '../../../core/utils/resultCodeToHttpException';
import { authService } from '../../application/auth.service';
import { TAuthRegistrationConfirmationInput } from '../input/auth-registration-confirmation-user.input';

export const registrationConfirmationUserHandler = async (
  req: TRequestWithBody<TAuthRegistrationConfirmationInput>,
  res: Response,
) => {
  const result = await authService.registerUserConfirmation(req.body);

  if (result.status !== EResultStatus.Success) {
    return res
      .status(resultCodeToHttpException(result.status))
      .send({ errorsMessages: result.extensions });
  }

  res.sendStatus(EHttpStatus.NO_CONTENT_204);
};
