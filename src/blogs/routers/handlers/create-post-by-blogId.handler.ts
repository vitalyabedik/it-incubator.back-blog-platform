import { Response } from 'express';
import { TRequestWithParamsAndBody } from '../../../core/types/request';
import { EHttpStatus } from '../../../core/constants/http';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { postsService } from '../../../posts/application/posts.service';
import { TPostCreateInput } from '../../../posts/routers/input/post-create.input';
import { TCreatePostByBlogIdParams } from './params/create-post-by-blogId-params';
import { mapToPostOutput } from '../../../posts/routers/mappers/map-to-post-output.util';

export const createPostByBlogId = async (
  req: TRequestWithParamsAndBody<TCreatePostByBlogIdParams, TPostCreateInput>,
  res: Response,
) => {
  try {
    const postId = await postsService.createPostByBlogId(
      req.params.blogId,
      req.body,
    );

    const createdPost = await postsService.getPostById(postId);

    const blogOutput = mapToPostOutput(createdPost);

    res.status(EHttpStatus.CREATED_201).send(blogOutput);
  } catch (error: unknown) {
    errorsHandler(error, res);
  }
};
