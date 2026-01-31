import { TCommentCreateInput } from '../../routers/input/comment-create.input';

export type TCreateCommentByPostIdParams = {
  userId: string;
  postId: string;
  dto: TCommentCreateInput;
};
