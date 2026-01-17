import request from 'supertest';
import { Express } from 'express';
import { POSTS_PATH } from '../../../src/core/constants/paths';
import { EHttpStatus } from '../../../src/core/constants/http';
import { TPostOutput } from '../../../src/posts/routers/output/post.output';

export const getPostById = async (
  app: Express,
  postId: string,
): Promise<TPostOutput> => {
  const blogResponse = await request(app)
    .get(`${POSTS_PATH}/${postId}`)
    .expect(EHttpStatus.OK_200);

  return blogResponse.body;
};
