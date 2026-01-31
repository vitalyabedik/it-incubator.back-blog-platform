import { Response } from 'express';
import { TRequestWithParamsAndBody } from '../../../core/types/request';
import { EHttpStatus } from '../../../core/constants/http';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { postsService } from '../../../posts/application/posts.service';
import { TPostCreateInput } from '../../../posts/routers/input/post-create.input';
import { TCreatePostByBlogIdParams } from './params/create-post-by-blogId-params';
import { postsQueryRepository } from '../../../posts/repositories/posts-query.repositories';

export const createPostByBlogId = async (
  req: TRequestWithParamsAndBody<TCreatePostByBlogIdParams, TPostCreateInput>,
  res: Response,
) => {
  try {
    const postId = await postsService.createPostByBlogId(
      req.params.id,
      req.body,
    );

    const createdPost = await postsQueryRepository.getPostById(postId);

    res.status(EHttpStatus.CREATED_201).send(createdPost);
  } catch (error: unknown) {
    errorsHandler(error, res);
  }
};
