import { TUserOutput } from '../../../users/repositories/output/user.output';
import { TComment } from '../../model/comment.model';
import { TCommentCreateInput } from '../../routers/input/comment-create.input';

type TArgs = {
  user: TUserOutput;
  postId: string;
  dto: TCommentCreateInput;
};

export const mapToDbComment = ({
  user,
  postId,
  dto,
}: TArgs): Omit<TComment, '_id'> => ({
  postId,
  content: dto.content,
  commentatorInfo: {
    userId: user.id,
    userLogin: user.login,
  },
  createdAt: new Date(),
  likesInfo: {
    likesCount: 0,
    dislikesCount: 0,
  },
});
