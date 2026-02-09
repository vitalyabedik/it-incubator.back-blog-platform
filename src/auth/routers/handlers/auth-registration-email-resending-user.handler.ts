import { Response } from 'express';
import { EResultStatus } from '../../../core/constants/resultCode';
import { TRequestWithBody } from '../../../core/types/request';
import { resultCodeToHttpException } from '../../../core/utils/resultCodeToHttpException';
import { authService } from '../../application/auth.service';
import { TAuthRegistrationEmailResendingInput } from '../input/auth-registration-email-resending-user.input';

export const registrationEmailResendingUserHandler = async (
  req: TRequestWithBody<TAuthRegistrationEmailResendingInput>,
  res: Response,
) => {
  const result = await authService.registerUserEmailResending(req.body);

  if (result.status !== EResultStatus.Success) {
    return res
      .status(resultCodeToHttpException(result.status))
      .send({ errorsMessages: result.extensions });
  }

  res.sendStatus(resultCodeToHttpException(result.status));
};
