import { Response } from 'express';
import { TRequestWithBody } from '../../../core/types/request';
import { EHttpStatus } from '../../../core/constants/http';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { mapToPostOutput } from '../mappers/map-to-post-output.util';
import { TPostCreateInput } from '../input/post-create.input';
import { postsService } from '../../application/posts.service';

export const createPostHandler = async (
  req: TRequestWithBody<TPostCreateInput>,
  res: Response,
) => {
  try {
    const createdPostId = await postsService.create(req.body);

    const createdPost = await postsService.getPostById(createdPostId);

    const postOutput = mapToPostOutput(createdPost);

    res.status(EHttpStatus.CREATED_201).send(postOutput);
  } catch (error: unknown) {
    errorsHandler(error, res);
  }
};
