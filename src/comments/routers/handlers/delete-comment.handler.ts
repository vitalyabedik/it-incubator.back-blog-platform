import { Response } from 'express';
import { TRequestWithParams } from '../../../core/types/request';
import { EHttpStatus } from '../../../core/constants/http';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { commentsService } from '../../application/comments.service';
import { TDeleteCommentParams } from './params/delete-comment-params';

export const deleteCommentHandler = async (
  req: TRequestWithParams<TDeleteCommentParams>,
  res: Response,
) => {
  try {
    await commentsService.delete(req.params.commentId);

    res.sendStatus(EHttpStatus.NO_CONTENT_204);
  } catch (error: unknown) {
    errorsHandler(error, res);
  }
};
