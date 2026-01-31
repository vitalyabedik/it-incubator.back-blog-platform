import { Response } from 'express';
import { TRequestWithUserId } from '../../../core/types/request';
import { EHttpStatus } from '../../../core/constants/http';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { TId } from '../../../core/types/id';
import { usersQueryRepository } from '../../../users/repositories/users-query.repositories';

export const getMeUserHandler = async (
  req: TRequestWithUserId<TId>,
  res: Response,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.sendStatus(EHttpStatus.UNAUTHORIZED_401);

    const me = await usersQueryRepository.getUserMeById(userId);

    res.send(me);
  } catch (error: unknown) {
    errorsHandler(error, res);
  }
};
