import { TCommentQueryRepositoryOutput } from '../output/comment-query-repository.output';
import { TCommentOutput } from '../output/comment.output';

export const mapToCommentOutput = (
  comment: TCommentQueryRepositoryOutput,
): TCommentOutput => ({
  id: comment._id.toString(),
  content: comment.content,
  commentatorInfo: {
    userId: comment.commentatorInfo.userId,
    userLogin: comment.commentatorInfo.userLogin,
  },
  createdAt: comment.createdAt,
});
