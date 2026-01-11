import request from 'supertest';
import { Express } from 'express';
import { TBlogInputDto } from '../../../src/blogs/dto/blogs.input-dto';
import { TBlogViewModel } from '../../../src/blogs/types';
import { getBlogDto } from './get-blog-dto';
import { BLOGS_PATH } from '../../../src/core/constants/paths';
import { EHttpStatus } from '../../../src/core/constants/http';
import { generateBasicAuthToken } from '../generate-admin-auth-token';

export const createBlog = async (
  app: Express,
  blogDto?: TBlogInputDto,
): Promise<TBlogViewModel> => {
  const defaultBlogData: TBlogInputDto = getBlogDto();

  const testBlogData = { ...defaultBlogData, ...blogDto };

  const createdBlogResponse = await request(app)
    .post(BLOGS_PATH)
    .set('Authorization', generateBasicAuthToken())
    .send(testBlogData)
    .expect(EHttpStatus.CREATED_201);

  return createdBlogResponse.body;
};
