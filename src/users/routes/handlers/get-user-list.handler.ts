import { Response } from 'express';
import { matchedData } from 'express-validator';
import { TRequestWithQuery } from '../../../core/types/request';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { setDefaultSortAndPagination } from '../../../core/utils/set-default-sort-and-pagination';
import { TUserQueryInput } from '../input/user-query.input';
import { usersQueryRepository } from '../../repositories/users-query.repositories';
import { setDefaultUserFilters } from './utils/set-default-user-filters';

export const getUserListHandler = async (
  req: TRequestWithQuery<TUserQueryInput>,
  res: Response,
) => {
  try {
    const { searchLoginTerm, searchEmailTerm, ...restPaginationAndSort } =
      matchedData<TUserQueryInput>(req, {
        locations: ['query'],
        includeOptionals: true,
      });
    const queryInput = {
      ...setDefaultSortAndPagination(restPaginationAndSort),
      ...setDefaultUserFilters({ searchLoginTerm, searchEmailTerm }),
    };

    const userList = await usersQueryRepository.getUserList(queryInput);

    res.send(userList);
  } catch (error: unknown) {
    errorsHandler(error, res);
  }
};
