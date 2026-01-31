import { Response } from 'express';
import { TRequestWithParams } from '../../../core/types/request';
import { EHttpStatus } from '../../../core/constants/http';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { commentsService } from '../../application/comments.service';
import { commentsQueryRepository } from '../../repositories/comments-query.repositories';
import { TDeleteCommentParams } from './params/delete-comment-params';

export const deleteCommentHandler = async (
  req: TRequestWithParams<TDeleteCommentParams>,
  res: Response,
) => {
  try {
    const userId = req.user?.id;
    const commentId = req.params.id;

    const comment = await commentsQueryRepository.getCommentById(commentId);
    if (comment.commentatorInfo.userId !== userId)
      return res.sendStatus(EHttpStatus.FORBIDDEN_403);

    await commentsService.delete(req.params.id);

    res.sendStatus(EHttpStatus.NO_CONTENT_204);
  } catch (error: unknown) {
    errorsHandler(error, res);
  }
};
