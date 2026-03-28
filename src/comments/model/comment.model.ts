import { Model, model, Schema } from 'mongoose';
import {
  TComment,
  TCommentDocument,
  TCommentMethods,
  TCommentStaticMethods,
} from '../types/comments.types';
import { TCommentUpdateInput } from '../routers/input/comment-update.input';
import { ELikeStatus } from '../../likes/constants/like-status';
import { TLikeDocument } from '../../likes/types/like.types';
import { TCommentCreateInput } from '../routers/input/comment-create.input';
import { mapToDocumentComment } from '../repositories/mappers/map-to-document-comment.util';

type TCommentModel = Model<TComment, unknown, TCommentMethods> &
  TCommentStaticMethods;

const commentLikeSchema = new Schema(
  {
    likesCount: {
      type: Number,
      default: 0,
    },
    dislikesCount: {
      type: Number,
      default: 0,
    },
  },
  { _id: false },
);

const commentatorInfoSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    userLogin: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

const commentSchema = new Schema<TComment, TCommentModel, TCommentMethods>(
  {
    content: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
    },
    postId: {
      type: String,
      required: true,
    },
    commentatorInfo: {
      type: commentatorInfoSchema,
      required: true,
    },
    likesInfo: {
      type: commentLikeSchema,
      required: true,
    },
  },
  { collection: 'comments', versionKey: false },
);

commentSchema.method('isCommentOwner', function isCommentOwner(userId: string) {
  return this.commentatorInfo.userId === userId;
});

commentSchema.method(
  'updateComment',
  function updateComment(args: TCommentUpdateInput) {
    this.content = args.content;

    return this;
  },
);

commentSchema.method(
  'updateCommentLikesByIncomingLikeStatusAndLike',
  function updateCommentLikesByIncomingLikeStatusAndLike(dto: {
    like: TLikeDocument;
    likeStatus: ELikeStatus;
  }) {
    const { like, likeStatus } = dto;

    if (like.status === ELikeStatus.Like) {
      if (likeStatus === ELikeStatus.Dislike) {
        this.likesInfo.dislikesCount += 1;
        this.likesInfo.likesCount -= 1;
      }

      if (likeStatus === ELikeStatus.None) {
        this.likesInfo.likesCount -= 1;
      }
    }

    if (like.status === ELikeStatus.Dislike) {
      if (likeStatus === ELikeStatus.Like) {
        this.likesInfo.likesCount += 1;
        this.likesInfo.dislikesCount -= 1;
      }

      if (likeStatus === ELikeStatus.None) {
        this.likesInfo.dislikesCount -= 1;
      }
    }

    if (like.status === ELikeStatus.None) {
      if (likeStatus === ELikeStatus.Like) {
        this.likesInfo.likesCount += 1;
      }

      if (likeStatus === ELikeStatus.Dislike) {
        this.likesInfo.dislikesCount += 1;
      }
    }

    this.likesInfo.likesCount = Math.max(0, this.likesInfo.likesCount);
    this.likesInfo.dislikesCount = Math.max(0, this.likesInfo.dislikesCount);

    return this;
  },
);

commentSchema.method(
  'updateCommentLikesByIncomingLikeStatus',
  function updateCommentLikesByIncomingLikeStatus(likeStatus: ELikeStatus) {
    if (likeStatus === ELikeStatus.Like) {
      this.likesInfo.likesCount += 1;
    }

    if (likeStatus === ELikeStatus.Dislike) {
      this.likesInfo.dislikesCount += 1;
    }

    return this;
  },
);

commentSchema.static(
  'createCommentInstance',
  async function createCommentInstance(args: {
    postId: string;
    commentData: TCommentCreateInput;
    userData: { userId: string; userLogin: string };
  }): ReturnType<TCommentStaticMethods['createCommentInstance']> {
    const { postId, commentData, userData } = args;

    const newComment = mapToDocumentComment({
      userData,
      postId,
      dto: commentData,
    });

    const commentDocument = await this.create(newComment);

    return commentDocument as unknown as TCommentDocument;
  },
);

export const CommentModel = model<TComment, TCommentModel>(
  'comment',
  commentSchema,
);
