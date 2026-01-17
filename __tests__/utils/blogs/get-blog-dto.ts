import { TBlogCreateInput } from '../../../src/blogs/routers/input/blog-create.input';

export const getBlogDto = (): TBlogCreateInput => {
  return {
    name: 'default name',
    description: 'default blog description',
    websiteUrl: 'https://default-http.com',
  };
};
