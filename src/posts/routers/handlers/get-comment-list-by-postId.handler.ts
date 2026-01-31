import { Response } from 'express';
import { matchedData } from 'express-validator';
import { TRequestWithParamsAndQuery } from '../../../core/types/request';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { EHttpStatus } from '../../../core/constants/http';
import { commentsQueryRepository } from '../../../comments/repositories/comments-query.repositories';
import { TCommentQueryInput } from '../../../comments/routers/input/comment-query.input';
import { TGetCommentListByPostIdParams } from './params/get-comment-list-by-postId-params';
import { postsQueryRepository } from '../../repositories/posts-query.repositories';

export const getCommentListByPostIdHandler = async (
  req: TRequestWithParamsAndQuery<
    TGetCommentListByPostIdParams,
    TCommentQueryInput
  >,
  res: Response,
) => {
  try {
    const postId = req.params.id;

    const query = matchedData<TCommentQueryInput>(req, {
      locations: ['query'],
      includeOptionals: true,
    });

    const post = await postsQueryRepository.getPostById(postId);
    if (!post) return res.sendStatus(EHttpStatus.NOT_FOUND_404);

    const commentList = await commentsQueryRepository.getCommentListByPostId(
      postId,
      query,
    );

    res.send(commentList);
  } catch (error: unknown) {
    errorsHandler(error, res);
  }
};
