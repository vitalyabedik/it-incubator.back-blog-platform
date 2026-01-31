import { Response } from 'express';
import { matchedData } from 'express-validator';
import { TRequestWithParamsAndQuery } from '../../../core/types/request';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { commentsQueryRepository } from '../../../comments/repositories/comments-query.repositories';
import { TCommentQueryInput } from '../../../comments/routers/input/comment-query.input';
import { TGetCommentListByPostIdParams } from './params/get-comment-list-by-postId-params';

export const getCommentListByPostIdHandler = async (
  req: TRequestWithParamsAndQuery<
    TGetCommentListByPostIdParams,
    TCommentQueryInput
  >,
  res: Response,
) => {
  try {
    const query = matchedData<TCommentQueryInput>(req, {
      locations: ['query'],
      includeOptionals: true,
    });

    const commentList = await commentsQueryRepository.getCommentListByPostId(
      req.params.id,
      query,
    );

    res.send(commentList);
  } catch (error: unknown) {
    errorsHandler(error, res);
  }
};
