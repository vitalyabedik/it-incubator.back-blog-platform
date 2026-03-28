import { Types } from 'mongoose';
import { TPost } from '../../types/post.types';
import { TPostOutput } from '../output/post.output';
import { ELikeStatus } from '../../../likes/constants/like-status';
import { TLike } from '../../../likes/types/like.types';

type TArgs = {
  post: { _id: Types.ObjectId } & TPost;
  myStatus: ELikeStatus;
  newestLikes: TLike[];
};

export const mapToPostOutput = ({
  post,
  myStatus,
  newestLikes,
}: TArgs): TPostOutput => ({
  id: post._id.toString(),
  title: post.title,
  shortDescription: post.shortDescription,
  content: post.content,
  blogId: post.blogId,
  blogName: post.blogName,
  createdAt: post.createdAt.toISOString(),
  extendedLikesInfo: {
    likesCount: post.extendedLikesInfo.likesCount,
    dislikesCount: post.extendedLikesInfo.dislikesCount,
    myStatus,
    newestLikes: newestLikes.map((newestLike) => ({
      addedAt: newestLike.addedLikeDate?.toISOString() || '',
      userId: newestLike.authorId,
      login: newestLike.login,
    })),
  },
});
