import { Types } from 'mongoose';
import { TPaginationMeta } from '../../../core/types/pagination-and-sorting';
import { TPost } from '../../types/post.types';
import { TPostListPaginatedOutput } from '../output/post-list-paginated.output';
import { mapToPostOutput } from './map-to-post-output.util';
import { LikeModel } from '../../../likes/model/like.model';
import { ELikeStatus } from '../../../likes/constants/like-status';
import { TLike } from '../../../likes/types/like.types';
import { LIKES_LIMIT_COUNT } from '../posts-query.repositories';

type TNewestLikesByPostAggregationResult = {
  _id: string;
  newestLikes: TLike[];
};

export const mapToPostListPaginatedOutput = async (
  posts: ({ _id: Types.ObjectId } & TPost)[],
  meta: {
    pagination: TPaginationMeta;
  },
  userId?: string,
): Promise<TPostListPaginatedOutput> => {
  const { page, pageSize, totalCount } = meta.pagination;

  const postsIds = posts.map((post) => post._id.toString());

  if (postsIds.length === 0) {
    return {
      items: [],
      page: page,
      pageSize: pageSize,
      pagesCount: Math.ceil(totalCount / pageSize),
      totalCount: totalCount,
    };
  }

  const likesPromise = userId
    ? LikeModel.find({
        parentId: { $in: postsIds },
        authorId: userId,
      })
        .lean()
        .exec()
    : Promise.resolve([]);

  const newestLikesByPostsPromise =
    LikeModel.aggregate<TNewestLikesByPostAggregationResult>([
      {
        $match: {
          parentId: { $in: postsIds },
          status: ELikeStatus.Like,
        },
      },
      {
        $group: {
          _id: '$parentId',
          newestLikes: {
            $topN: {
              n: LIKES_LIMIT_COUNT,
              sortBy: { addedLikeDate: -1 },
              output: {
                addedLikeDate: '$addedLikeDate',
                authorId: '$authorId',
                login: '$login',
              },
            },
          },
        },
      },
    ]);

  const [likes, newestLikesByPosts] = await Promise.all([
    likesPromise,
    newestLikesByPostsPromise,
  ]);

  const likesMap = new Map(likes.map((like) => [like.parentId, like.status]));
  const newestLikesMap = new Map(
    newestLikesByPosts.map((item) => [item._id, item.newestLikes]),
  );

  return {
    page: page,
    pageSize: pageSize,
    pagesCount: Math.ceil(totalCount / pageSize),
    totalCount: totalCount,

    items: posts.map((post) => {
      const postId = post._id.toString();
      const myStatus = likesMap.get(postId) || ELikeStatus.None;
      const newestLikes = newestLikesMap.get(postId) || [];

      return mapToPostOutput({ post, myStatus, newestLikes });
    }),
  };
};
