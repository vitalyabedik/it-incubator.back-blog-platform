import { TPostInputDto } from '../../../src/posts/dto/posts.input-dto';

export const getPostDto = (blogId: string): TPostInputDto => {
  return {
    title: 'default post title',
    shortDescription: 'default post shortDescription',
    content: 'default post content',
    blogId,
  };
};
