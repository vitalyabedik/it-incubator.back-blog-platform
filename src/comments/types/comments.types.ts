import { HydratedDocument } from 'mongoose';
import { TCommentCreateInput } from '../routers/input/comment-create.input';
import { TCommentUpdateInput } from '../routers/input/comment-update.input';
import { TLikeDocument } from '../../likes/types/like.types';
import { ELikeStatus } from '../../likes/constants/like-status';

export type TComment = {
  content: string;
  createdAt: Date;
  postId: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
  };
};

export type TCommentDocument = HydratedDocument<TComment>;

export type TCommentStaticMethods = {
  createCommentInstance(dto: {
    postId: string;
    commentData: TCommentCreateInput;
    userData: { userId: string; userLogin: string };
  }): Promise<TCommentDocument>;
};

export type TCommentMethods = {
  isCommentOwner(userId: string): boolean;
  updateComment(content: TCommentUpdateInput['content']): TCommentDocument;
  updateCommentLikesByIncomingLikeStatusAndLike(dto: {
    like: TLikeDocument;
    likeStatus: ELikeStatus;
  }): TCommentDocument;
  updateCommentLikesByIncomingLikeStatus(
    likeStatus: ELikeStatus,
  ): TCommentDocument;
};
