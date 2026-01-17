import { TPostCreateInput } from '../../../src/posts/routers/input/post-create.input';

export const getPostDto = (blogId: string): TPostCreateInput => {
  return {
    title: 'default post title',
    shortDescription: 'default post shortDescription',
    content: 'default post content',
    blogId,
  };
};
