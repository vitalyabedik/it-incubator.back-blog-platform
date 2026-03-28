import { injectable } from 'inversify';
import { getPaginationParams } from '../../core/utils/getPaginationParams';
import { TCommentListQueryInput } from '../routers/input/comment-list-query.input';
import { TCommentQueryInput } from '../routers/input/comment-query.input';
import { TCommentListPaginatedOutput } from './output/comment-list-paginated.output';
import { TCommentOutput } from './output/comment.output';
import { mapToCommentListPaginatedOutput } from './mappers/map-to-comment-list-paginated-output.util.ts';
import { mapToCommentOutput } from './mappers/map-to-comment-output.util';
import { CommentModel } from '../model/comment.model';
import { LikeModel } from '../../likes/model/like.model';
import { ELikeStatus } from '../../likes/constants/like-status';

@injectable()
export class CommentsQueryRepository {
  constructor() {}

  async getCommentById({
    commentId,
    userId,
  }: TCommentQueryInput): Promise<TCommentOutput | null> {
    const comment = await CommentModel.findById(commentId).lean().exec();
    if (!comment) return null;

    const parentId = comment._id.toString();
    const like = userId
      ? await LikeModel.findOne({
          parentId,
          authorId: userId,
          status: { $ne: ELikeStatus.None },
        })
          .select('status')
          .lean()
          .exec()
      : null;
    const commentOutput = mapToCommentOutput({
      comment,
      likeStatus: like?.status || ELikeStatus.None,
    });

    return commentOutput;
  }

  async getCommentListByPostId(
    postId: string,
    queryDto: TCommentListQueryInput,
    userId?: string,
  ): Promise<TCommentListPaginatedOutput> {
    const { sort, skip, limit } = getPaginationParams(queryDto);

    const [items, totalCount] = await Promise.all([
      CommentModel.find({ postId })
        .lean()
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(),
      CommentModel.countDocuments({ postId }).exec(),
    ]);

    const commentsIds = items.map((c) => c._id.toString());

    const likes = userId
      ? await LikeModel.find({
          parentId: { $in: commentsIds },
          authorId: userId,
        })
          .lean()
          .exec()
      : [];

    const likesMap = new Map(likes.map((like) => [like.parentId, like.status]));

    const commentListOutput = mapToCommentListPaginatedOutput({
      comments: items,
      likesMap,
      meta: {
        pagination: {
          page: queryDto.pageNumber,
          pageSize: queryDto.pageSize,
          totalCount,
        },
      },
    });

    return commentListOutput;
  }
}
