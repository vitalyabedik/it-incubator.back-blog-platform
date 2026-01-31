import { Response } from 'express';
import { TRequestWithParams } from '../../../core/types/request';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { commentsQueryRepository } from '../../repositories/comments-query.repositories';
import { TGetCommentParams } from './params/get-comment-params';

export const getCommentHandler = async (
  req: TRequestWithParams<TGetCommentParams>,
  res: Response,
) => {
  try {
    const comment = await commentsQueryRepository.getCommentById(req.params.id);

    res.send(comment);
  } catch (error: unknown) {
    errorsHandler(error, res);
  }
};
