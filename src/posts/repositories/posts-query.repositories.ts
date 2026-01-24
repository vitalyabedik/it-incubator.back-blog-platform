import { ObjectId } from 'mongodb';
import { postCollection } from '../../db/mongo.db';
import { TPostListQueryRepositoryOutput } from './output/post-list-query-repository.output';
import { TPostQueryInput } from '../routers/input/post-query.input';
import { TPostQueryRepositoryOutput } from './output/post-query-repository.output';
import { RepositoryNotFoundError } from '../../core/errors/repository-not-found.error';
import { errorMessages } from '../constants/texts';

export const postsQueryRepository = {
  async getPostList(
    queryDto: TPostQueryInput,
  ): Promise<TPostListQueryRepositoryOutput> {
    const { pageNumber, pageSize, sortBy, sortDirection } = queryDto;

    const skip = (pageNumber - 1) * pageSize;

    const items = await postCollection
      .find()
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    const totalCount = await postCollection.countDocuments();

    return { items, totalCount };
  },

  async getPostListByBlogId(
    blogId: string,
    queryDto: TPostQueryInput,
  ): Promise<TPostListQueryRepositoryOutput> {
    const { pageNumber, pageSize, sortBy, sortDirection } = queryDto;

    const filter = { blogId };
    const skip = (pageNumber - 1) * pageSize;

    const [items, totalCount] = await Promise.all([
      postCollection
        .find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(pageSize)
        .toArray(),
      postCollection.countDocuments(filter),
    ]);

    return { items, totalCount };
  },

  async getPostById(id: string): Promise<TPostQueryRepositoryOutput> {
    const res = await postCollection.findOne({ _id: new ObjectId(id) });

    if (!res) {
      throw new RepositoryNotFoundError(errorMessages.noExist);
    }

    return res;
  },
};
