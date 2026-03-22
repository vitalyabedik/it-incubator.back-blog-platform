import { ELikeStatus } from '../../../likes/constants/like-status';

type TCommentatorInfo = {
  userId: string;
  userLogin: string;
};

type TLikesInfo = {
  likesCount: number;
  dislikesCount: number;
  myStatus: ELikeStatus;
};

export type TCommentOutput = {
  id: string;
  content: string;
  commentatorInfo: TCommentatorInfo;
  createdAt: string;
  likesInfo: TLikesInfo;
};
