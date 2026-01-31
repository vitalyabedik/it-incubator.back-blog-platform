import { Response } from 'express';
import { TRequestWithParams } from '../../../core/types/request';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { usersQueryRepository } from '../../repositories/users-query.repositories';
import { TGetUserParams } from './params/get-user-params';

export const getUserHandler = async (
  req: TRequestWithParams<TGetUserParams>,
  res: Response,
) => {
  try {
    const user = await usersQueryRepository.getUserById(req.params.id);

    res.send(user);
  } catch (error: unknown) {
    errorsHandler(error, res);
  }
};
