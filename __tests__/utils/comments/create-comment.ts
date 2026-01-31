import request from 'supertest';
import { Express } from 'express';
import { POSTS_PATH, routersPaths } from '../../../src/core/constants/paths';
import { EHttpStatus } from '../../../src/core/constants/http';
import { TCommentCreateInput } from '../../../src/comments/routers/input/comment-create.input';
import { TCommentOutput } from '../../../src/comments/repositories/output/comment.output';
import { getCommentDto } from './get-comment-dto';

type TArgs = {
  app: Express;
  accessToken: string;
  postId: string;
  commentDto?: TCommentCreateInput;
};

export const createComment = async ({
  app,
  accessToken,
  postId,
  commentDto,
}: TArgs): Promise<TCommentOutput> => {
  const defaultCommentDto = {
    ...getCommentDto(),
    ...commentDto,
  };

  const createdCommentResponse = await request(app)
    .post(`${POSTS_PATH}/${postId}${routersPaths.comments}`)
    .set('Authorization', `Bearer ${accessToken}`)
    .send(defaultCommentDto)
    .expect(EHttpStatus.CREATED_201);

  return createdCommentResponse.body;
};
