import request from 'supertest';
import { Express } from 'express';
import { POSTS_PATH } from '../../../src/core/constants/paths';
import { EHttpStatus } from '../../../src/core/constants/http';
import { TPostView } from '../../../src/posts/types';

export const getPostById = async (
  app: Express,
  postId: string,
): Promise<TPostView> => {
  const blogResponse = await request(app)
    .get(`${POSTS_PATH}/${postId}`)
    .expect(EHttpStatus.OK_200);

  return blogResponse.body;
};
