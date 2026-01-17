import request from 'supertest';
import { Express } from 'express';
import { TBlogOutput } from '../../../src/blogs/routers/output/blog.output';
import { BLOGS_PATH } from '../../../src/core/constants/paths';
import { EHttpStatus } from '../../../src/core/constants/http';

export const getBlogById = async (
  app: Express,
  blogId: string,
): Promise<TBlogOutput> => {
  const blogResponse = await request(app)
    .get(`${BLOGS_PATH}/${blogId}`)
    .expect(EHttpStatus.OK_200);

  return blogResponse.body;
};
