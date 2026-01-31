import { ObjectId } from 'mongodb';
import { commentCollection } from '../../db/mongo.db';
import { TCommentUpdateInput } from '../routers/input/comment-update.input';
import { RepositoryNotFoundError } from '../../core/errors/repository-not-found.error';
import { errorMessages } from '../constants/texts';
import { TCommentDB } from '../domain/commentDB';

export const commentsRepository = {
  async create(newComment: TCommentDB): Promise<string> {
    const insertResult = await commentCollection.insertOne(newComment);

    return insertResult.insertedId.toString();
  },

  async update(id: string, dto: TCommentUpdateInput): Promise<void> {
    const { content } = dto;

    const { modifiedCount } = await commentCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          content,
        },
      },
    );

    if (modifiedCount < 1) {
      throw new RepositoryNotFoundError(errorMessages.noExist);
    }

    return;
  },

  async delete(id: string): Promise<void> {
    const { deletedCount } = await commentCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (deletedCount < 1) {
      throw new RepositoryNotFoundError(errorMessages.noExist);
    }

    return;
  },
};
