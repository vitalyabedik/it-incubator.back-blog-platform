import request from 'supertest';
import { Express } from 'express';
import { getBlogDto } from './get-blog-dto';
import { BLOGS_PATH } from '../../../src/core/constants/paths';
import { EHttpStatus } from '../../../src/core/constants/http';
import { TBlogCreateInput } from '../../../src/blogs/routers/input/blog-create.input';
import { TBlogOutput } from '../../../src/blogs/routers/output/blog.output';

type TCreateBlogArgs = {
  app: Express;
  authToken: string;
  blogDto?: TBlogCreateInput;
};

export const createBlog = async ({
  app,
  authToken,
  blogDto,
}: TCreateBlogArgs): Promise<TBlogOutput> => {
  const defaultBlogData: TBlogCreateInput = getBlogDto();

  const testBlogData = { ...defaultBlogData, ...blogDto };

  const createdBlogResponse = await request(app)
    .post(BLOGS_PATH)
    .set('Authorization', authToken)
    .send(testBlogData)
    .expect(EHttpStatus.CREATED_201);

  return createdBlogResponse.body;
};
