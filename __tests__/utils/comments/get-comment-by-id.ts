import request from 'supertest';
import { Express } from 'express';
import { COMMENTS_PATH } from '../../../src/core/constants/paths';
import { EHttpStatus } from '../../../src/core/constants/http';
import { TCommentOutput } from '../../../src/comments/repositories/output/comment.output';

type TArgs = {
  app: Express;
  commentId: string;
};

export const getCommentById = async ({
  app,
  commentId,
}: TArgs): Promise<TCommentOutput> => {
  const commentResponse = await request(app)
    .get(`${COMMENTS_PATH}/${commentId}`)
    .expect(EHttpStatus.OK_200);

  return commentResponse.body;
};
