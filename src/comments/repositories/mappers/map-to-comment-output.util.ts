import { Types } from 'mongoose';
import { ELikeStatus } from '../../../likes/constants/like-status';
import { TComment } from '../../types/comments.types';
import { TCommentOutput } from '../output/comment.output';

type TArgs = {
  comment: { _id: Types.ObjectId } & TComment;
  likeStatus: ELikeStatus;
};

export const mapToCommentOutput = ({
  comment,
  likeStatus,
}: TArgs): TCommentOutput => ({
  id: comment._id.toString(),
  content: comment.content,
  commentatorInfo: {
    userId: comment.commentatorInfo.userId,
    userLogin: comment.commentatorInfo.userLogin,
  },
  createdAt: comment.createdAt.toISOString(),
  likesInfo: {
    likesCount: comment.likesInfo.likesCount,
    dislikesCount: comment.likesInfo.dislikesCount,
    myStatus: likeStatus,
  },
});
