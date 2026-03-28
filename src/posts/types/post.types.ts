import { HydratedDocument } from 'mongoose';
import { TPostCreateInput } from '../routers/input/post-create.input';
import { ELikeStatus } from '../../likes/constants/like-status';
import { TLikeDocument } from '../../likes/types/like.types';
import { TPostUpdateInput } from '../routers/input/post-update.input';

export type TPost = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
  };
};

export type TPostDocument = HydratedDocument<TPost>;

export type TPostStaticMethods = {
  createPostInstance(dto: {
    blogName: string;
    postData: TPostCreateInput;
  }): Promise<TPostDocument>;
};

export type TPostMethods = {
  updatePost(dto: TPostUpdateInput): TPostDocument;
  updatePostLikesByIncomingLikeStatus(likeStatus: ELikeStatus): TPostDocument;
  updatePostLikesByIncomingLikeStatusAndLike(dto: {
    like: TLikeDocument;
    likeStatus: ELikeStatus;
  }): TPostDocument;
};
