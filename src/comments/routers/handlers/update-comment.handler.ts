import { Response } from 'express';
import { TRequestWithParamsAndBody } from '../../../core/types/request';
import { EHttpStatus } from '../../../core/constants/http';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { commentsService } from '../../application/comments.service';
import { TCommentUpdateInput } from '../input/comment-update.input';
import { TUpdateCommentParams } from './params/update-comment-params';

export const updateCommentHandler = async (
  req: TRequestWithParamsAndBody<TUpdateCommentParams, TCommentUpdateInput>,
  res: Response,
) => {
  try {
    await commentsService.update(req.params.commentId, req.body);

    res.sendStatus(EHttpStatus.NO_CONTENT_204);
  } catch (error: unknown) {
    errorsHandler(error, res);
  }
};
