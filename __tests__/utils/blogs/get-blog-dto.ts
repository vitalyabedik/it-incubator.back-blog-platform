import { TBlogInputDto } from '../../../src/blogs/dto/blogs.input-dto';

export const getBlogDto = (): TBlogInputDto => {
  return {
    name: 'default name',
    description: 'default blog description',
    websiteUrl: 'https://default-http.com',
  };
};
