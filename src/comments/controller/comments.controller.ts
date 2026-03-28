import { Response } from 'express';
import { inject, injectable } from 'inversify';
import {
  TRequestWithParams,
  TRequestWithParamsAndBody,
} from '../../core/types/request';
import { CommentsQueryRepository } from '../repositories/comments-query.repositories';
import { TCommentUpdateInput } from '../routers/input/comment-update.input';
import { EHttpStatus } from '../../core/constants/http';
import { CommentsService } from '../application/comments.service';
import { TGetCommentParams } from './params/get-comment-params';
import { TUpdateCommentParams } from './params/update-comment-params';
import { TDeleteCommentParams } from './params/delete-comment-params';
import { getUserIdFromAccessToken } from '../../core/utils/get-user-id-from-access-token';
import { EResultStatus } from '../../core/constants/resultCode';
import { resultCodeToHttpException } from '../../core/utils/resultCodeToHttpException';
import { TCommentUpdateLikeStatusInput } from '../routers/input/comment-update-like-status.input';

@injectable()
export class CommentsController {
  constructor(
    @inject(CommentsService)
    private commentsService: CommentsService,
    @inject(CommentsQueryRepository)
    private commentsQueryRepository: CommentsQueryRepository,
  ) {}

  async getComment(req: TRequestWithParams<TGetCommentParams>, res: Response) {
    const commentId = req.params.id;
    const userId =
      (await getUserIdFromAccessToken(req.headers.authorization)) || undefined;

    const comment = await this.commentsQueryRepository.getCommentById({
      commentId,
      userId,
    });
    if (!comment) {
      return res.sendStatus(EHttpStatus.NOT_FOUND_404);
    }

    return res.send(comment);
  }

  async updateCommentById(
    req: TRequestWithParamsAndBody<TUpdateCommentParams, TCommentUpdateInput>,
    res: Response,
  ) {
    const userId = req.user?.id!;
    const commentId = req.params.id;
    const content = req.body.content;

    const result = await this.commentsService.updateCommentById({
      userId,
      commentId,
      content,
    });

    if (result.status !== EResultStatus.Success) {
      return res.sendStatus(resultCodeToHttpException(result.status));
    }

    return res.sendStatus(EHttpStatus.NO_CONTENT_204);
  }

  async updateCommentLikeStatus(
    req: TRequestWithParamsAndBody<
      TUpdateCommentParams,
      TCommentUpdateLikeStatusInput
    >,
    res: Response,
  ) {
    const userId = req.user?.id!;
    const login = req.login!;
    const commentId = req.params.id;
    const likeStatus = req.body.likeStatus;

    const result = await this.commentsService.updateCommentLikeStatus({
      userId,
      login,
      commentId,
      likeStatus,
    });

    if (result.status !== EResultStatus.Success) {
      return res.sendStatus(resultCodeToHttpException(result.status));
    }

    return res.sendStatus(EHttpStatus.NO_CONTENT_204);
  }

  async deleteComment(
    req: TRequestWithParams<TDeleteCommentParams>,
    res: Response,
  ) {
    const userId = req.user?.id!;
    const commentId = req.params.id;

    const result = await this.commentsService.delete({
      userId,
      commentId,
    });

    if (result.status !== EResultStatus.Success) {
      return res.sendStatus(resultCodeToHttpException(result.status));
    }

    return res.sendStatus(EHttpStatus.NO_CONTENT_204);
  }
}
