import { Types } from 'mongoose';
import { TPaginationMeta } from '../../../core/types/pagination-and-sorting';
import { ELikeStatus } from '../../../likes/constants/like-status';
import { TComment } from '../../types/comments.types';
import { TCommentListPaginatedOutput } from '../output/comment-list-paginated.output';
import { mapToCommentOutput } from './map-to-comment-output.util';

type TArgs = {
  comments: ({ _id: Types.ObjectId } & TComment)[];
  likesMap: Map<string, ELikeStatus>;
  meta: {
    pagination: TPaginationMeta;
  };
};

export const mapToCommentListPaginatedOutput = ({
  comments,
  likesMap,
  meta,
}: TArgs): TCommentListPaginatedOutput => {
  const { page, pageSize, totalCount } = meta.pagination;

  return {
    page: page,
    pageSize: pageSize,
    pagesCount: Math.ceil(totalCount / pageSize),
    totalCount: totalCount,

    items: comments.map((comment) => {
      const myStatus = likesMap.get(comment._id.toString()) || ELikeStatus.None;

      return mapToCommentOutput({
        comment,
        likeStatus: myStatus,
      });
    }),
  };
};
