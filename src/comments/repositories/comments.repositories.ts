import { injectable } from 'inversify';
import { Types } from 'mongoose';
import {
  CommentModel,
  TComment,
  TCommentDocument,
} from '../model/comment.model';

@injectable()
export class CommentsRepository {
  constructor() {}

  async findCommentById(id: string) {
    return await CommentModel.findById(id);
  }

  async create(newComment: Omit<TComment, '_id'>): Promise<string> {
    const { id } = await CommentModel.create(newComment);

    return id;
  }

  async delete(id: string) {
    const { deletedCount } = await CommentModel.deleteOne({
      _id: new Types.ObjectId(id),
    });

    return deletedCount > 0;
  }

  async saveComment(commentDocument: TCommentDocument) {
    await commentDocument.save();
  }
}
