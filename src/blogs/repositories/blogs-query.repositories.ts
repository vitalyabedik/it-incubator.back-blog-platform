import { ObjectId } from 'mongodb';
import { blogCollection } from '../../db/mongo.db';
import { RepositoryNotFoundError } from '../../core/errors/repository-not-found.error';
import { getPaginationParams } from '../../core/utils/getPaginationParams';
import { errorMessages } from '../constants/texts';
import { TBlogQueryInput } from '../routers/input/blog-query.input';
import { createBlogFilter } from './utils/create-blog-filter';
import { TBlogListPaginatedOutput } from './output/blog-list-paginated.output';
import { TBlogOutput } from './output/blog.output';
import { mapToBlogListPaginatedOutput } from './mappers/map-to-blog-list-paginated-output.util.ts';
import { mapToBlogOutput } from './mappers/map-to-blog-output.util';

export const blogsQueryRepository = {
  async getBlogList(
    queryDto: TBlogQueryInput,
  ): Promise<TBlogListPaginatedOutput> {
    const { sort, skip, limit } = getPaginationParams(queryDto);
    const filter = createBlogFilter(queryDto);

    const items = await blogCollection
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray();

    const totalCount = await blogCollection.countDocuments(filter);

    const blogListOutput = mapToBlogListPaginatedOutput(items, {
      pagination: {
        page: queryDto.pageNumber,
        pageSize: queryDto.pageSize,
        totalCount,
      },
    });

    return blogListOutput;
  },

  async getBlogById(id: string): Promise<TBlogOutput> {
    const res = await blogCollection.findOne({ _id: new ObjectId(id) });

    if (!res) {
      throw new RepositoryNotFoundError(errorMessages.noExist);
    }

    const blogOutput = mapToBlogOutput(res);

    return blogOutput;
  },
};
