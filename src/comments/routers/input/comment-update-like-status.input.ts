import { ELikeStatus } from '../../../likes/constants/like-status';

export type TCommentUpdateLikeStatusInput = {
  userId: string;
  commentId: string;
  likeStatus: ELikeStatus;
};
