import { Response } from 'express';
import { TRequestWithParamsAndBody } from '../../../core/types/request';
import { EHttpStatus } from '../../../core/constants/http';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { TCreateCommentByPostIdParams } from './params/create-comment-by-postId-params';
import { TCommentCreateInput } from '../../../comments/routers/input/comment-create.input';
import { commentsService } from '../../../comments/application/comments.service';
import { commentsQueryRepository } from '../../../comments/repositories/comments-query.repositories';

export const createCommentByPostId = async (
  req: TRequestWithParamsAndBody<
    TCreateCommentByPostIdParams,
    TCommentCreateInput
  >,
  res: Response,
) => {
  try {
    const commentId = await commentsService.createCommentByPostId({
      userId: req.user?.id || '',
      postId: req.params.postId,
      dto: req.body,
    });

    const createdComment =
      await commentsQueryRepository.getCommentById(commentId);

    res.status(EHttpStatus.CREATED_201).send(createdComment);
  } catch (error: unknown) {
    errorsHandler(error, res);
  }
};
