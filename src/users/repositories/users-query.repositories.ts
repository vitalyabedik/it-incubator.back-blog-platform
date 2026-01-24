import { ObjectId } from 'mongodb';
import { userCollection } from '../../db/mongo.db';
import { RepositoryNotFoundError } from '../../core/errors/repository-not-found.error';
import { getPaginationParams } from '../../core/utils/getPaginationParams';
import { TUserQueryInput } from '../routes/input/user-query.input';
import { errorMessages } from '../constants/texts';
import { createUserFilter } from './utils/create-user-filter';
import { TUserListQueryRepositoryOutput } from './output/user-list-query-repository.output';
import { TUserQueryRepositoryOutput } from './output/user-query-repository.output';

export const usersQueryRepository = {
  async getUserList(
    queryDto: TUserQueryInput,
  ): Promise<TUserListQueryRepositoryOutput> {
    const { sort, skip, limit } = getPaginationParams(queryDto);
    const filter = createUserFilter(queryDto);

    const items = await userCollection
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray();

    const totalCount = await userCollection.countDocuments(filter);

    return { items, totalCount };
  },

  async getUserById(id: string): Promise<TUserQueryRepositoryOutput> {
    const res = await userCollection.findOne({ _id: new ObjectId(id) });

    if (!res) {
      throw new RepositoryNotFoundError(errorMessages.noExist);
    }

    return res;
  },
};
