import { TCommentCreateInput } from '../../routers/input/comment-create.input';
import { TComment } from '../../types/comments.types';

type TArgs = {
  userData: { userId: string; userLogin: string };
  postId: string;
  dto: TCommentCreateInput;
};

export const mapToDocumentComment = ({
  userData,
  postId,
  dto,
}: TArgs): TComment => ({
  postId,
  content: dto.content,
  commentatorInfo: {
    userId: userData.userId,
    userLogin: userData.userLogin,
  },
  createdAt: new Date(),
  likesInfo: {
    likesCount: 0,
    dislikesCount: 0,
  },
});
