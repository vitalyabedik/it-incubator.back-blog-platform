import { ObjectId } from 'mongodb';
import { blogCollection } from '../../db/mongo.db';
import { TBlogUpdateInput } from './../routers/input/blog-update.input';
import { RepositoryNotFoundError } from '../../core/errors/repository-not-found.error';
import { errorMessages } from '../constants/texts';
import { TBlog } from '../domain/blog';
import { TBlogQueryInput } from '../routers/input/blog-query.input';
import { TBlogListRepositoryOutput } from './output/blog-list-repository.output';
import { TBlogRepositoryOutput } from './output/blog-repository.output';
import { createBlogFilter } from './utils/create-blog-filter';

export const blogsRepository = {
  async getBlogList(
    queryDto: TBlogQueryInput,
  ): Promise<TBlogListRepositoryOutput> {
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

  async getBlogById(id: string): Promise<TBlogRepositoryOutput> {
    const res = await blogCollection.findOne({ _id: new ObjectId(id) });

    if (!res) {
      throw new RepositoryNotFoundError(errorMessages.noExist);
    }

    return res;
  },

  async create(newBlog: TBlog): Promise<string> {
    const insertResult = await blogCollection.insertOne(newBlog);

    return insertResult.insertedId.toString();
  },

  async update(id: string, dto: TBlogUpdateInput): Promise<void> {
    const { name, description, websiteUrl } = dto;

    const { modifiedCount } = await blogCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name,
          description,
          websiteUrl,
        },
      },
    );

    if (modifiedCount < 1) {
      throw new RepositoryNotFoundError(errorMessages.noExist);
    }

    return;
  },

  async delete(id: string): Promise<void> {
    const { deletedCount } = await blogCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (deletedCount < 1) {
      throw new RepositoryNotFoundError(errorMessages.noExist);
    }

    return;
  },
};
