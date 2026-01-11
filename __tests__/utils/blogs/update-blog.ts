import request from 'supertest';
import { Express } from 'express';
import { TBlogInputDto } from '../../../src/blogs/dto/blogs.input-dto';
import { getBlogDto } from './get-blog-dto';
import { BLOGS_PATH } from '../../../src/core/constants/paths';
import { EHttpStatus } from '../../../src/core/constants/http';
import { generateBasicAuthToken } from '../generate-admin-auth-token';

export const updateBlog = async (
  app: Express,
  blogId: string,
  blogDto?: TBlogInputDto,
): Promise<void> => {
  const defaultBlogData: TBlogInputDto = getBlogDto();

  const testBlogData = { ...defaultBlogData, ...blogDto };

  const updatedBlogResponse = await request(app)
    .put(`${BLOGS_PATH}/${blogId}`)
    .set('Authorization', generateBasicAuthToken())
    .send(testBlogData)
    .expect(EHttpStatus.NO_CONTENT_204);

  return updatedBlogResponse.body;
};
