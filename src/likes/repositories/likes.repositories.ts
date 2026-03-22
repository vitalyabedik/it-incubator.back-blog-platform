import { injectable } from 'inversify';
import { LikeModel, TLike, TLikeDocument } from '../model/like.model';
import { TLikeQueryInput } from './input/like-query.input';

@injectable()
export class LikesRepository {
  async findLikeByFilter({ authorId, parentId }: TLikeQueryInput) {
    return await LikeModel.findOne({ parentId, authorId });
  }

  async createLike(blog: Omit<TLike, '_id'>) {
    const { id } = await LikeModel.create(blog);

    return id;
  }

  async save(likeDocument: TLikeDocument) {
    await likeDocument.save();
  }
}
