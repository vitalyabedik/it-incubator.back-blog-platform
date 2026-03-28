import { ELikeStatus } from '../../../likes/constants/like-status';

export type TCommentUpdateLikeStatusInput = {
  userId: string;
  login: string;
  commentId: string;
  likeStatus: ELikeStatus;
};
