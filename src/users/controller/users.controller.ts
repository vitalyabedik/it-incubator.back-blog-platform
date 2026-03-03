import { Response } from 'express';
import { inject, injectable } from 'inversify';
import { matchedData } from 'express-validator';
import { UsersQueryRepository } from '../repositories/users-query.repositories';
import {
  TRequestWithBody,
  TRequestWithParams,
  TRequestWithQuery,
} from '../../core/types/request';
import { errorsHandler } from '../../core/errors/errors.handler';
import { TUserQueryInput } from '../routes/input/user-query.input';
import { setDefaultSortAndPagination } from '../../core/utils/set-default-sort-and-pagination';
import { UsersService } from '../application/users.service';
import { TUserCreateInput } from '../routes/input/user-create.input';
import { EHttpStatus } from '../../core/constants/http';
import { setDefaultUserFilters } from './utils/set-default-user-filters';
import { TDeleteUserParams } from './params/delete-user-params';

@injectable()
export class UsersController {
  constructor(
    @inject(UsersService)
    private usersService: UsersService,
    @inject(UsersQueryRepository)
    private usersQueryRepository: UsersQueryRepository,
  ) {}

  async getUserList(req: TRequestWithQuery<TUserQueryInput>, res: Response) {
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

      const userList = await this.usersQueryRepository.getUserList(queryInput);

      res.send(userList);
    } catch (error: unknown) {
      errorsHandler(error, res);
    }
  }

  async createUser(req: TRequestWithBody<TUserCreateInput>, res: Response) {
    try {
      const createdUserIdOrError = await this.usersService.create(req.body);
      if (
        typeof createdUserIdOrError !== 'string' &&
        'errorsMessages' in createdUserIdOrError
      ) {
        res.status(EHttpStatus.BAD_REQUEST_400).send(createdUserIdOrError);
        return;
      }

      const createdUser =
        await this.usersQueryRepository.getUserById(createdUserIdOrError);

      res.status(EHttpStatus.CREATED_201).send(createdUser);
    } catch (error: unknown) {
      errorsHandler(error, res);
    }
  }

  async deleteUser(req: TRequestWithParams<TDeleteUserParams>, res: Response) {
    try {
      await this.usersService.delete(req.params.id);

      res.sendStatus(EHttpStatus.NO_CONTENT_204);
    } catch (error: unknown) {
      errorsHandler(error, res);
    }
  }
}
