import { Response } from 'express';
import { TRequestWithParamsAndBody } from '../../../core/types/request';
import { EHttpStatus } from '../../../core/constants/http';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { commentsService } from '../../application/comments.service';
import { commentsQueryRepository } from '../../repositories/comments-query.repositories';
import { TCommentUpdateInput } from '../input/comment-update.input';
import { TUpdateCommentParams } from './params/update-comment-params';

export const updateCommentHandler = async (
  req: TRequestWithParamsAndBody<TUpdateCommentParams, TCommentUpdateInput>,
  res: Response,
) => {
  try {
    const userId = req.user?.id;
    const commentId = req.params.id;

    const comment = await commentsQueryRepository.getCommentById(commentId);
    if (comment.commentatorInfo.userId !== userId)
      return res.sendStatus(EHttpStatus.FORBIDDEN_403);

    await commentsService.update(commentId, req.body);

    res.sendStatus(EHttpStatus.NO_CONTENT_204);
  } catch (error: unknown) {
    errorsHandler(error, res);
  }
};
