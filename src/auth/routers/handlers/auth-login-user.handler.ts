import { TAuthLoginInput } from '../input/auth-login.input';
import { Response } from 'express';
import { TRequestWithBody } from '../../../core/types/request';
import { EHttpStatus } from '../../../core/constants/http';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { authService } from '../../application/auth.service';

export const loginUserHandler = async (
  req: TRequestWithBody<TAuthLoginInput>,
  res: Response,
) => {
  try {
    const accessToken = await authService.loginUser(req.body);
    if (!accessToken) return res.sendStatus(EHttpStatus.UNAUTHORIZED_401);

    res.sendStatus(EHttpStatus.NO_CONTENT_204);
  } catch (error: unknown) {
    errorsHandler(error, res);
  }
};
