import { injectable } from 'inversify';
import { Types } from 'mongoose';
import { PostModel } from '../model/post.model';
import { TPostDocument } from '../types/post.types';

@injectable()
export class PostsRepository {
  constructor() {}

  async findPostById(id: string) {
    return await PostModel.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const { deletedCount } = await PostModel.deleteOne({
      _id: new Types.ObjectId(id),
    });

    return deletedCount > 0;
  }

  async savePost(postDocument: TPostDocument) {
    await postDocument.save();
  }
}
