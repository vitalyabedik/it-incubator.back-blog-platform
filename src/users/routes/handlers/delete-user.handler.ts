import { Response } from 'express';
import { TRequestWithParams } from '../../../core/types/request';
import { EHttpStatus } from '../../../core/constants/http';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { usersService } from '../../application/users.service';
import { TDeleteUserParams } from './params/delete-user-params';

export const deleteUserHandler = async (
  req: TRequestWithParams<TDeleteUserParams>,
  res: Response,
) => {
  try {
    await usersService.delete(req.params.id);

    res.sendStatus(EHttpStatus.NO_CONTENT_204);
  } catch (error: unknown) {
    errorsHandler(error, res);
  }
};
