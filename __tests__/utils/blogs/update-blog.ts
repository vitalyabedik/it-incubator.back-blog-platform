import request from 'supertest';
import { Express } from 'express';
import { TBlogUpdateInput } from '../../../src/blogs/routers/input/blog-update.input';
import { BLOGS_PATH } from '../../../src/core/constants/paths';
import { EHttpStatus } from '../../../src/core/constants/http';
import { getBlogDto } from './get-blog-dto';

type TUpdateBlogArgs = {
  app: Express;
  authToken: string;
  blogId: string;
  blogDto?: TBlogUpdateInput;
};

export const updateBlog = async ({
  app,
  authToken,
  blogId,
  blogDto,
}: TUpdateBlogArgs): Promise<void> => {
  const defaultBlogData: TBlogUpdateInput = getBlogDto();

  const testBlogData = { ...defaultBlogData, ...blogDto };

  const updatedBlogResponse = await request(app)
    .put(`${BLOGS_PATH}/${blogId}`)
    .set('Authorization', authToken)
    .send(testBlogData)
    .expect(EHttpStatus.NO_CONTENT_204);

  return updatedBlogResponse.body;
};
