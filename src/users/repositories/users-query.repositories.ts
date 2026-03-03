import { injectable } from 'inversify';
import { ObjectId } from 'mongodb';
import { userCollection } from '../../db/mongo.db';
import { RepositoryNotFoundError } from '../../core/errors/repository-not-found.error';
import { getPaginationParams } from '../../core/utils/getPaginationParams';
import { TUserQueryInput } from '../routes/input/user-query.input';
import { errorMessages } from '../constants/texts';
import { createUserFilter } from './utils/create-user-filter';
import { TUserListPaginatedOutput } from './output/user-list-paginated.output';
import { TUserOutput } from './output/user.output';
import { TUserMeOutput } from './output/user-me.output';
import { mapToUserListPaginatedOutput } from './mappers/map-to-user-list-paginated-output.util';
import { mapToUserOutput } from './mappers/map-to-user-output.util';
import { mapToMeUserOutput } from './mappers/map-to-me-user-output.util';

@injectable()
export class UsersQueryRepository {
  constructor() {}

  async getUserList(
    queryDto: TUserQueryInput,
  ): Promise<TUserListPaginatedOutput> {
    const { sort, skip, limit } = getPaginationParams(queryDto);
    const filter = createUserFilter(queryDto);

    const items = await userCollection
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray();

    const totalCount = await userCollection.countDocuments(filter);

    const userListOutput = mapToUserListPaginatedOutput(items, {
      pagination: {
        page: queryDto.pageNumber,
        pageSize: queryDto.pageSize,
        totalCount,
      },
    });

    return userListOutput;
  }

  async getUserById(id: string): Promise<TUserOutput> {
    const res = await userCollection.findOne({ _id: new ObjectId(id) });

    if (!res) {
      throw new RepositoryNotFoundError(errorMessages.noExist);
    }

    const userOutput = mapToUserOutput(res);

    return userOutput;
  }

  async getUserMeById(id: string): Promise<TUserMeOutput> {
    const res = await userCollection.findOne({ _id: new ObjectId(id) });

    if (!res) {
      throw new RepositoryNotFoundError(errorMessages.noExist);
    }

    const userMeOutput = mapToMeUserOutput(res);

    return userMeOutput;
  }
}
