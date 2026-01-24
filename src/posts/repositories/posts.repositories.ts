import { ObjectId } from 'mongodb';
import { TPost } from '../domain/post';
import { TPostUpdateInput } from '../routers/input/post-update.input';
import { postCollection } from '../../db/mongo.db';
import { RepositoryNotFoundError } from '../../core/errors/repository-not-found.error';
import { errorMessages } from '../constants/texts';

export const postsRepository = {
  async create(newPost: TPost): Promise<string> {
    const insertResult = await postCollection.insertOne(newPost);

    return insertResult.insertedId.toString();
  },

  async update(id: string, dto: TPostUpdateInput): Promise<void> {
    const { blogId, content, shortDescription, title } = dto;

    const { modifiedCount } = await postCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          blogId,
          content,
          shortDescription,
          title,
        },
      },
    );

    if (modifiedCount < 1) {
      throw new RepositoryNotFoundError(errorMessages.noExist);
    }

    return;
  },

  async delete(id: string): Promise<void> {
    const { deletedCount } = await postCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (deletedCount < 1) {
      throw new RepositoryNotFoundError(errorMessages.noExist);
    }

    return;
  },
};
