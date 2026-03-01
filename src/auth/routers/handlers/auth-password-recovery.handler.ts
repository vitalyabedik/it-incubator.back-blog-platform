import { Response } from 'express';
import { TRequestWithBody } from '../../../core/types/request';
import { EHttpStatus } from '../../../core/constants/http';
import { authService } from '../../application/auth.service';
import { TAuthPasswordRecoveryInput } from '../input/auth-password-recovery.input';

export const passwordRecoveryHandler = async (
  req: TRequestWithBody<TAuthPasswordRecoveryInput>,
  res: Response,
) => {
  await authService.passwordRecovery(req.body);

  res.sendStatus(EHttpStatus.NO_CONTENT_204);
};
