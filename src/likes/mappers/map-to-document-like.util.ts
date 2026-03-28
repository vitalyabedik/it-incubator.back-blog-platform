import { ELikeStatus } from '../constants/like-status';
import { TLikeCreateInput } from '../repositories/input/like-create.input';
import { TLike } from '../types/like.types';

export const mapToDocumentLike = (likeDocument: TLikeCreateInput): TLike => ({
  authorId: likeDocument.authorId,
  login: likeDocument.login,
  parentId: likeDocument.parentId,
  status: likeDocument.likeStatus,
  createdAt: new Date(),
  addedLikeDate:
    likeDocument.likeStatus === ELikeStatus.Like ? new Date() : null,
});
