import { ObjectId } from 'mongodb';
import { userCollection } from '../../db/mongo.db';
import { RepositoryNotFoundError } from '../../core/errors/repository-not-found.error';
import { TUserQueryInput } from '../routes/input/user-query.input';
import { errorMessages } from '../constants/texts';
import { createUserFilter } from './utils/create-user-filter';
import { TUserListQueryRepositoryOutput } from './output/user-list-query-repository.output';
import { TUserQueryRepositoryOutput } from './output/user-query-repository.output';

export const usersQueryRepository = {
  async getUserList(
    queryDto: TUserQueryInput,
  ): Promise<TUserListQueryRepositoryOutput> {
    const { pageNumber, pageSize, sortBy, sortDirection } = queryDto;

    const skip = (pageNumber - 1) * pageSize;
    const filter = createUserFilter(queryDto);

    const items = await userCollection
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
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
