import request from 'supertest';
import { Express } from 'express';
import { TBlogInputDto } from '../../../src/blogs/dto/blogs.input-dto';
import { TBlogView } from '../../../src/blogs/types';
import { getBlogDto } from './get-blog-dto';
import { BLOGS_PATH } from '../../../src/core/constants/paths';
import { EHttpStatus } from '../../../src/core/constants/http';

export const createBlog = async (
  app: Express,
  blogDto?: TBlogInputDto,
): Promise<TBlogView> => {
  const defaultBlogData: TBlogInputDto = getBlogDto();

  const testBlogData = { ...defaultBlogData, ...blogDto };

  const createdBlogResponse = await request(app)
    .post(BLOGS_PATH)
    .send(testBlogData)
    .expect(EHttpStatus.Created_201);

  return createdBlogResponse.body;
};
