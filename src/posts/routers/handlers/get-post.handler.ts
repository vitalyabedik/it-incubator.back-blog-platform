import { Response } from 'express';
import { TRequestWithParams } from '../../../core/types/request';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { postsQueryRepository } from '../../repositories/posts-query.repositories';
import { TGetPostParams } from './params/get-post-params';

export const getPostHandler = async (
  req: TRequestWithParams<TGetPostParams>,
  res: Response,
) => {
  try {
    const post = await postsQueryRepository.getPostById(req.params.id);

    res.send(post);
  } catch (error: unknown) {
    errorsHandler(error, res);
  }
};
