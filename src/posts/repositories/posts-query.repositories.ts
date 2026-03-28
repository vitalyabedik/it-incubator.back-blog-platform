import { injectable } from 'inversify';
import { TPostQueryInput } from '../routers/input/post-query.input';
import { getPaginationParams } from '../../core/utils/getPaginationParams';
import { TPostOutput } from './output/post.output';
import { TPostListPaginatedOutput } from './output/post-list-paginated.output';
import { mapToPostListPaginatedOutput } from './mappers/map-to-post-list-paginated-output.util copy';
import { mapToPostOutput } from './mappers/map-to-post-output.util';
import { PostModel } from '../model/post.model';

import { LikeModel } from '../../likes/model/like.model';
import { ELikeStatus } from '../../likes/constants/like-status';

export const LIKES_LIMIT_COUNT = 3;

@injectable()
export class PostsQueryRepository {
  constructor() {}

  async getPostList(
    queryDto: TPostQueryInput,
    userId?: string,
  ): Promise<TPostListPaginatedOutput> {
    const { sort, skip, limit } = getPaginationParams(queryDto);

    const [items, totalCount] = await Promise.all([
      PostModel.find().lean().sort(sort).skip(skip).limit(limit),
      PostModel.countDocuments(),
    ]);

    const postListOutput = mapToPostListPaginatedOutput(
      items,
      {
        pagination: {
          page: queryDto.pageNumber,
          pageSize: queryDto.pageSize,
          totalCount,
        },
      },
      userId,
    );

    return postListOutput;
  }

  async getPostListByBlogId(
    blogId: string,
    queryDto: TPostQueryInput,
    userId?: string,
  ): Promise<TPostListPaginatedOutput> {
    const { sort, skip, limit } = getPaginationParams(queryDto);

    const [items, totalCount] = await Promise.all([
      PostModel.find({ blogId }).lean().sort(sort).skip(skip).limit(limit),
      PostModel.countDocuments({ blogId }),
    ]);

    const postListOutput = mapToPostListPaginatedOutput(
      items,
      {
        pagination: {
          page: queryDto.pageNumber,
          pageSize: queryDto.pageSize,
          totalCount,
        },
      },
      userId,
    );

    return postListOutput;
  }

  async getPostById({
    id,
    userId,
  }: {
    id: string;
    userId?: string;
  }): Promise<TPostOutput | null> {
    const post = await PostModel.findById(id).lean().exec();
    if (!post) return null;

    const likePromise = userId
      ? LikeModel.findOne({ parentId: id, authorId: userId })
          .select('status')
          .lean()
          .exec()
      : Promise.resolve(null);

    const newestLikesPromise = LikeModel.find({
      parentId: id,
      status: ELikeStatus.Like,
    })
      .sort({ addedLikeDate: -1 })
      .limit(LIKES_LIMIT_COUNT)
      .lean()
      .exec();

    const [like, newestLikes] = await Promise.all([
      likePromise,
      newestLikesPromise,
    ]);

    const myStatus = like ? like.status : ELikeStatus.None;

    const postOutput = mapToPostOutput({ post, myStatus, newestLikes });

    return postOutput;
  }
}
