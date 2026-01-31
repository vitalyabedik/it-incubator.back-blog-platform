import { ObjectId } from 'mongodb';
import { postCollection } from '../../db/mongo.db';
import { TPostQueryInput } from '../routers/input/post-query.input';
import { RepositoryNotFoundError } from '../../core/errors/repository-not-found.error';
import { getPaginationParams } from '../../core/utils/getPaginationParams';
import { errorMessages } from '../constants/texts';
import { TPostOutput } from './output/post.output';
import { TPostListPaginatedOutput } from './output/post-list-paginated.output';
import { mapToPostListPaginatedOutput } from './mappers/map-to-post-list-paginated-output.util copy';
import { mapToPostOutput } from './mappers/map-to-post-output.util';

export const postsQueryRepository = {
  async getPostList(
    queryDto: TPostQueryInput,
  ): Promise<TPostListPaginatedOutput> {
    const { sort, skip, limit } = getPaginationParams(queryDto);

    const items = await postCollection
      .find()
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray();

    const totalCount = await postCollection.countDocuments();

    const postListOutput = mapToPostListPaginatedOutput(items, {
      pagination: {
        page: queryDto.pageNumber,
        pageSize: queryDto.pageSize,
        totalCount,
      },
    });

    return postListOutput;
  },

  async getPostListByBlogId(
    blogId: string,
    queryDto: TPostQueryInput,
  ): Promise<TPostListPaginatedOutput> {
    const { sort, skip, limit } = getPaginationParams(queryDto);
    const filter = { blogId };

    const [items, totalCount] = await Promise.all([
      postCollection.find(filter).sort(sort).skip(skip).limit(limit).toArray(),
      postCollection.countDocuments(filter),
    ]);

    const postListOutput = mapToPostListPaginatedOutput(items, {
      pagination: {
        page: queryDto.pageNumber,
        pageSize: queryDto.pageSize,
        totalCount,
      },
    });

    return postListOutput;
  },

  async getPostById(id: string): Promise<TPostOutput> {
    const res = await postCollection.findOne({ _id: new ObjectId(id) });

    if (!res) {
      throw new RepositoryNotFoundError(errorMessages.noExist);
    }

    const postOutput = mapToPostOutput(res);

    return postOutput;
  },
};
