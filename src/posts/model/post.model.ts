import { Model, model, Schema } from 'mongoose';
import {
  TPost,
  TPostDocument,
  TPostMethods,
  TPostStaticMethods,
} from '../types/post.types';
import { TPostUpdateInput } from '../routers/input/post-update.input';
import { ELikeStatus } from '../../likes/constants/like-status';
import { TLikeDocument } from '../../likes/types/like.types';
import { TPostCreateInput } from '../routers/input/post-create.input';
import { mapToDocumentPost } from '../repositories/mappers/map-to-document-post.util';

type TPostModel = Model<TPost, unknown, TPostMethods> & TPostStaticMethods;

const postLikeSchema = new Schema(
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

const postSchema = new Schema<TPost, TPostModel, TPostMethods>(
  {
    title: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    blogId: {
      type: String,
      required: true,
    },
    blogName: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
    },
    extendedLikesInfo: {
      type: postLikeSchema,
      required: true,
    },
  },
  { collection: 'posts', versionKey: false },
);

postSchema.method('updatePost', function updateBlog(args: TPostUpdateInput) {
  this.blogId = args.blogId;
  this.title = args.title;
  this.shortDescription = args.shortDescription;
  this.content = args.content;

  return this;
});

postSchema.method(
  'updatePostLikesByIncomingLikeStatus',
  function updatePostLikesByIncomingLikeStatus(likeStatus: ELikeStatus) {
    if (likeStatus === ELikeStatus.Like) {
      this.extendedLikesInfo.likesCount += 1;
    }

    if (likeStatus === ELikeStatus.Dislike) {
      this.extendedLikesInfo.dislikesCount += 1;
    }

    return this;
  },
);

postSchema.method(
  'updatePostLikesByIncomingLikeStatusAndLike',
  function updatePostLikesByIncomingLikeStatusAndLike(args: {
    like: TLikeDocument;
    likeStatus: ELikeStatus;
  }) {
    const { like, likeStatus } = args;

    if (like.status === ELikeStatus.Like) {
      if (likeStatus === ELikeStatus.Dislike) {
        this.extendedLikesInfo.dislikesCount += 1;
        this.extendedLikesInfo.likesCount -= 1;
      }

      if (likeStatus === ELikeStatus.None) {
        this.extendedLikesInfo.likesCount -= 1;
      }
    }

    if (like.status === ELikeStatus.Dislike) {
      if (likeStatus === ELikeStatus.Like) {
        this.extendedLikesInfo.likesCount += 1;
        this.extendedLikesInfo.dislikesCount -= 1;
      }

      if (likeStatus === ELikeStatus.None) {
        this.extendedLikesInfo.dislikesCount -= 1;
      }
    }

    if (like.status === ELikeStatus.None) {
      if (likeStatus === ELikeStatus.Like) {
        this.extendedLikesInfo.likesCount += 1;
      }

      if (likeStatus === ELikeStatus.Dislike) {
        this.extendedLikesInfo.dislikesCount += 1;
      }
    }

    this.extendedLikesInfo.likesCount = Math.max(
      0,
      this.extendedLikesInfo.likesCount,
    );
    this.extendedLikesInfo.dislikesCount = Math.max(
      0,
      this.extendedLikesInfo.dislikesCount,
    );

    return this;
  },
);

postSchema.static(
  'createPostInstance',
  async function createPostInstance({
    blogName,
    postData,
  }: {
    blogName: string;
    postData: TPostCreateInput;
  }): ReturnType<TPostStaticMethods['createPostInstance']> {
    const newPost = mapToDocumentPost({ blogName, dto: postData });

    const postDocument = await this.create(newPost);

    return postDocument as unknown as TPostDocument;
  },
);

export const PostModel = model<TPost, TPostModel>('post', postSchema);
