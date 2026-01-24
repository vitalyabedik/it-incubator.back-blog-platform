import { ObjectId } from 'mongodb';
import { blogCollection } from '../../db/mongo.db';
import { TBlogUpdateInput } from './../routers/input/blog-update.input';
import { RepositoryNotFoundError } from '../../core/errors/repository-not-found.error';
import { errorMessages } from '../constants/texts';
import { TBlog } from '../domain/blog';

export const blogsRepository = {
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
