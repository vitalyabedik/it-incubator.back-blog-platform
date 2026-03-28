import { ELikeStatus } from '../../../likes/constants/like-status';

type TNewestLike = {
  addedAt: string;
  userId: string;
  login: string;
};

export type TPostOutput = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: ELikeStatus;
    newestLikes: TNewestLike[];
  };
};
