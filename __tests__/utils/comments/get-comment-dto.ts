import { TCommentCreateInput } from '../../../src/comments/routers/input/comment-create.input';

export const getCommentDto = (): TCommentCreateInput => {
  return {
    content: 'базовый комментарий для тестов',
  };
};
