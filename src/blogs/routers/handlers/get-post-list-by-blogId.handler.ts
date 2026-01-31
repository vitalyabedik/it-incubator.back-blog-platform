import { Response } from 'express';
import { matchedData } from 'express-validator';
import { TRequestWithParamsAndQuery } from '../../../core/types/request';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { EHttpStatus } from '../../../core/constants/http';
import { TPostQueryInput } from '../../../posts/routers/input/post-query.input';
import { postsQueryRepository } from '../../../posts/repositories/posts-query.repositories';
import { TGetPostListByBlogIdParams } from './params/get-post-list-by-blogId-params';
import { blogsQueryRepository } from '../../repositories/blogs-query.repositories';

export const getPostListByBlogIdHandler = async (
  req: TRequestWithParamsAndQuery<TGetPostListByBlogIdParams, TPostQueryInput>,
  res: Response,
) => {
  try {
    const blogId = req.params.blogId;

    const query = matchedData<TPostQueryInput>(req, {
      locations: ['query'],
      includeOptionals: true,
    });

    const blog = blogsQueryRepository.getBlogById(blogId);
    if (!blog) return res.sendStatus(EHttpStatus.NOT_FOUND_404);

    const postList = await postsQueryRepository.getPostListByBlogId(
      blogId,
      query,
    );

    res.send(postList);
  } catch (error: unknown) {
    errorsHandler(error, res);
  }
};
