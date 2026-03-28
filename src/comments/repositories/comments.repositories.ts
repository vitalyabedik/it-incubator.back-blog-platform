import { injectable } from 'inversify';
import { Types } from 'mongoose';
import { CommentModel } from '../model/comment.model';
import { TCommentDocument } from '../types/comments.types';

@injectable()
export class CommentsRepository {
  constructor() {}

  async findCommentById(id: string) {
    return await CommentModel.findById(id);
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
