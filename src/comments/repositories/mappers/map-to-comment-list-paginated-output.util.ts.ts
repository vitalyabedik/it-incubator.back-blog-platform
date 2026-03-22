import { TPaginationMeta } from '../../../core/types/pagination-and-sorting';
import { ELikeStatus } from '../../../likes/constants/like-status';
import { TLike } from '../../../likes/model/like.model';
import { TComment } from '../../model/comment.model';
import { TCommentListPaginatedOutput } from '../output/comment-list-paginated.output';
import { mapToCommentOutput } from './map-to-comment-output.util';

type TArgs = {
  comments: TComment[];
  likes: TLike[];
  userId?: string;
  meta: {
    pagination: TPaginationMeta;
  };
};

export const mapToCommentListPaginatedOutput = ({
  comments,
  likes,
  userId,
  meta,
}: TArgs): TCommentListPaginatedOutput => {
  const { page, pageSize, totalCount } = meta.pagination;

  return {
    page: page,
    pageSize: pageSize,
    pagesCount: Math.ceil(totalCount / pageSize),
    totalCount: totalCount,

    items: comments.map((comment) => {
      const like = likes.find(
        (like) =>
          like.parentId === comment._id.toString() && like.authorId === userId,
      );

      return mapToCommentOutput({
        comment,
        likeStatus:
          like && like.authorId === userId ? like.status : ELikeStatus.None,
      });
    }),
  };
};
