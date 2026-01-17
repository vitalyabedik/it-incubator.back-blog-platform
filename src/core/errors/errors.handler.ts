import { Response } from 'express';
import { RepositoryNotFoundError } from './repository-not-found.error';
import { EHttpStatus } from '../constants/http';
import { createErrorMessages } from '../utils/errors';
import { DomainError } from './domain.error';

export const errorsHandler = (error: unknown, res: Response): void => {
  if (error instanceof RepositoryNotFoundError) {
    const httpStatus = EHttpStatus.NOT_FOUND_404;

    res.status(httpStatus).send(
      createErrorMessages([
        {
          field: error.name,
          message: error.message,
        },
      ]),
    );

    return;
  }

  if (error instanceof DomainError) {
    const httpStatus = EHttpStatus.UNPROCESSABLE_ENTITY_422;

    res.status(httpStatus).send(
      createErrorMessages([
        {
          field: error.name,
          message: error.message,
        },
      ]),
    );

    return;
  }

  console.log(error);

  res.status(EHttpStatus.INTERNAL_SERVER_ERROR_500);
  return;
};
