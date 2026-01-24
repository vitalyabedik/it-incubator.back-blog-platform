import { ObjectId } from 'mongodb';
import { blogCollection } from '../../db/mongo.db';
import { RepositoryNotFoundError } from '../../core/errors/repository-not-found.error';
import { errorMessages } from '../constants/texts';
import { TBlogQueryInput } from '../routers/input/blog-query.input';
import { createBlogFilter } from './utils/create-blog-filter';
import { TBlogListQueryRepositoryOutput } from './output/blog-list-query-repository.output';
import { TBlogQueryRepositoryOutput } from './output/blog-query-repository.output';

export const blogsQueryRepository = {
  async getBlogList(
    queryDto: TBlogQueryInput,
  ): Promise<TBlogListQueryRepositoryOutput> {
    const { pageNumber, pageSize, sortBy, sortDirection } = queryDto;

    const skip = (pageNumber - 1) * pageSize;
    const filter = createBlogFilter(queryDto);

    const items = await blogCollection
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    const totalCount = await blogCollection.countDocuments(filter);

    return { items, totalCount };
  },

  async getBlogById(id: string): Promise<TBlogQueryRepositoryOutput> {
    const res = await blogCollection.findOne({ _id: new ObjectId(id) });

    if (!res) {
      throw new RepositoryNotFoundError(errorMessages.noExist);
    }

    return res;
  },
};
