import { injectable } from 'inversify';
import { LikeModel } from '../model/like.model';
import { TLikeQueryInput } from './input/like-query.input';
import { TLikeDocument } from '../types/like.types';

@injectable()
export class LikesRepository {
  async findLikeByFilter({ authorId, parentId }: TLikeQueryInput) {
    return await LikeModel.findOne({ parentId, authorId });
  }

  async saveLike(likeDocument: TLikeDocument) {
    await likeDocument.save();
  }
}
