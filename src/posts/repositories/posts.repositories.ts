import { injectable } from 'inversify';
import { Types } from 'mongoose';
import { RepositoryNotFoundError } from '../../core/errors/repository-not-found.error';
import { errorMessages } from '../constants/texts';
import { PostModel, TPost, TPostDocument } from '../model/post.model';

@injectable()
export class PostsRepository {
  constructor() {}

  async findPostById(id: string) {
    const res = await PostModel.findById(id);

    if (!res) {
      throw new RepositoryNotFoundError(errorMessages.noExist);
    }

    return res;
  }

  async create(newDbPost: Omit<TPost, '_id'>): Promise<string> {
    const { id } = await PostModel.create(newDbPost);

    return id;
  }

  async delete(id: string): Promise<void> {
    const { deletedCount } = await PostModel.deleteOne({
      _id: new Types.ObjectId(id),
    });

    if (deletedCount < 1) {
      throw new RepositoryNotFoundError(errorMessages.noExist);
    }
  }

  async savePost(postDocument: TPostDocument) {
    await postDocument.save();
  }
}
