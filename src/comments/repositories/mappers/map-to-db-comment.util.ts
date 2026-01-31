import { TUserOutput } from '../../../users/repositories/output/user.output';

import { TCommentDB } from '../../domain/commentDB';
import { TCommentCreateInput } from '../../routers/input/comment-create.input';

type TArgs = {
  user: TUserOutput;
  postId: string;
  dto: TCommentCreateInput;
};

export const mapToDbComment = ({ user, postId, dto }: TArgs): TCommentDB => ({
  postId,
  content: dto.content,
  commentatorInfo: {
    userId: user.id,
    userLogin: user.login,
  },
  createdAt: new Date().toISOString(),
});
