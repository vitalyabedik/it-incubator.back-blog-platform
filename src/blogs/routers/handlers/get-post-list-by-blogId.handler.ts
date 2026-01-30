import { Response } from 'express';
import { matchedData } from 'express-validator';
import { TRequestWithParamsAndQuery } from '../../../core/types/request';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { TPostQueryInput } from '../../../posts/routers/input/post-query.input';
import { postsQueryRepository } from '../../../posts/repositories/posts-query.repositories';
import { TGetPostListByBlogIdParams } from './params/get-post-list-by-blogId-params';

export const getPostListByBlogIdHandler = async (
  req: TRequestWithParamsAndQuery<TGetPostListByBlogIdParams, TPostQueryInput>,
  res: Response,
) => {
  try {
    const query = matchedData<TPostQueryInput>(req, {
      locations: ['query'],
      includeOptionals: true,
    });

    const postList = await postsQueryRepository.getPostListByBlogId(
      req.params.blogId,
      query,
    );

    res.send(postList);
  } catch (error: unknown) {
    errorsHandler(error, res);
  }
};
