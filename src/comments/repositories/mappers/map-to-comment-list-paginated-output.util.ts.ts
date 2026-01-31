import { TPaginationMeta } from '../../../core/types/pagination-and-sorting';
import { TCommentQueryRepositoryOutput } from '../output/comment-query-repository.output';
import { TCommentListPaginatedOutput } from '../output/comment-list-paginated.output';

export const mapToCommentListPaginatedOutput = (
  comments: TCommentQueryRepositoryOutput[],
  meta: {
    pagination: TPaginationMeta;
  },
): TCommentListPaginatedOutput => {
  const { page, pageSize, totalCount } = meta.pagination;

  return {
    page: page,
    pageSize: pageSize,
    pagesCount: Math.ceil(totalCount / pageSize),
    totalCount: totalCount,

    items: comments.map((comment) => ({
      id: comment._id.toString(),
      content: comment.content,
      commentatorInfo: {
        userId: comment.commentatorInfo.userId,
        userLogin: comment.commentatorInfo.userLogin,
      },
      createdAt: comment.createdAt,
    })),
  };
};
