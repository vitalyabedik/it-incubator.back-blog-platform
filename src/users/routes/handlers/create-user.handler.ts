import { Response } from 'express';
import { TRequestWithBody } from '../../../core/types/request';
import { EHttpStatus } from '../../../core/constants/http';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { TUserCreateInput } from '../input/user-create.input';
import { usersService } from '../../application/users.service';
import { usersQueryRepository } from '../../repositories/users-query.repositories';
import { mapToUserOutput } from '../mappers/map-to-user-output.util';

export const createUserHandler = async (
  req: TRequestWithBody<TUserCreateInput>,
  res: Response,
) => {
  try {
    const createdUserIdOrError = await usersService.create(req.body);
    if (
      typeof createdUserIdOrError !== 'string' &&
      'errorsMessages' in createdUserIdOrError
    ) {
      res.status(EHttpStatus.BAD_REQUEST_400).send(createdUserIdOrError);
      return;
    }

    const createdUser =
      await usersQueryRepository.getUserById(createdUserIdOrError);

    const userOutput = mapToUserOutput(createdUser);

    res.status(EHttpStatus.CREATED_201).send(userOutput);
  } catch (error: unknown) {
    errorsHandler(error, res);
  }
};
