import { Response } from 'express';
import { TRequestWithParams } from '../../../core/types/request';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { mapToPostOutput } from '../mappers/map-to-post-output.util';
import { TGetPostParams } from './params/get-post-params';
import { postsService } from '../../application/posts.service';

export const getPostHandler = async (
  req: TRequestWithParams<TGetPostParams>,
  res: Response,
) => {
  try {
    const post = await postsService.getPostById(req.params.id);

    const postOutput = mapToPostOutput(post);

    res.send(postOutput);
  } catch (error: unknown) {
    errorsHandler(error, res);
  }
};
