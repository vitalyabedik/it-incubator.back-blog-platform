import { Response } from 'express';
import { inject, injectable } from 'inversify';
import {
  TRequestWithParams,
  TRequestWithParamsAndBody,
} from '../../core/types/request';
import { errorsHandler } from '../../core/errors/errors.handler';
import { CommentsQueryRepository } from '../repositories/comments-query.repositories';
import { TCommentUpdateInput } from '../routers/input/comment-update.input';
import { EHttpStatus } from '../../core/constants/http';
import { CommentsService } from '../application/comments.service';
import { TGetCommentParams } from './params/get-comment-params';
import { TUpdateCommentParams } from './params/update-comment-params';
import { TDeleteCommentParams } from './params/delete-comment-params';

@injectable()
export class CommentsController {
  constructor(
    @inject(CommentsService)
    private commentsService: CommentsService,
    @inject(CommentsQueryRepository)
    private commentsQueryRepository: CommentsQueryRepository,
  ) {}

  async getComment(req: TRequestWithParams<TGetCommentParams>, res: Response) {
    try {
      const comment = await this.commentsQueryRepository.getCommentById(
        req.params.id,
      );

      res.send(comment);
    } catch (error: unknown) {
      errorsHandler(error, res);
    }
  }

  async updateComment(
    req: TRequestWithParamsAndBody<TUpdateCommentParams, TCommentUpdateInput>,
    res: Response,
  ) {
    try {
      const userId = req.user?.id;
      const commentId = req.params.id;

      const comment =
        await this.commentsQueryRepository.getCommentById(commentId);
      if (comment.commentatorInfo.userId !== userId)
        return res.sendStatus(EHttpStatus.FORBIDDEN_403);

      await this.commentsService.update(commentId, req.body);

      res.sendStatus(EHttpStatus.NO_CONTENT_204);
    } catch (error: unknown) {
      errorsHandler(error, res);
    }
  }

  async deleteComment(
    req: TRequestWithParams<TDeleteCommentParams>,
    res: Response,
  ) {
    try {
      const userId = req.user?.id;
      const commentId = req.params.id;

      const comment =
        await this.commentsQueryRepository.getCommentById(commentId);
      if (comment.commentatorInfo.userId !== userId)
        return res.sendStatus(EHttpStatus.FORBIDDEN_403);

      await this.commentsService.delete(req.params.id);

      res.sendStatus(EHttpStatus.NO_CONTENT_204);
    } catch (error: unknown) {
      errorsHandler(error, res);
    }
  }
}
