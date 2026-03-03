import { injectable } from 'inversify';
import { ObjectId } from 'mongodb';
import { blogCollection } from '../../db/mongo.db';
import { TBlogUpdateInput } from './../routers/input/blog-update.input';
import { RepositoryNotFoundError } from '../../core/errors/repository-not-found.error';
import { errorMessages } from '../constants/texts';
import { TBlogDB } from '../domain/blogDB';

@injectable()
export class BlogsRepository {
  constructor() {}

  async create(newDbBlog: TBlogDB): Promise<string> {
    const insertResult = await blogCollection.insertOne(newDbBlog);

    return insertResult.insertedId.toString();
  }

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
  }

  async delete(id: string): Promise<void> {
    const { deletedCount } = await blogCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (deletedCount < 1) {
      throw new RepositoryNotFoundError(errorMessages.noExist);
    }

    return;
  }
}
