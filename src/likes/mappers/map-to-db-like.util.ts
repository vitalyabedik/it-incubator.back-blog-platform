import { ELikeStatus } from '../constants/like-status';
import { TLike } from '../model/like.model';

type TArgs = {
  userId: string;
  parentId: string;
  likeStatus: ELikeStatus;
};

export const mapToDbLike = ({
  userId,
  parentId,
  likeStatus,
}: TArgs): Omit<TLike, '_id'> => ({
  authorId: userId,
  createdAt: new Date(),
  parentId,
  status: likeStatus,
});
