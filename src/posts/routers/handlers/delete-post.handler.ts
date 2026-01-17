import { Response } from 'express';
import { EHttpStatus } from '../../../core/constants/http';
import { TRequestWithParams } from '../../../core/types/request';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { TDeletePostParams } from './params/delete-post-params';
import { postsService } from '../../application/posts.service';

export const deletePostHandler = async (
  req: TRequestWithParams<TDeletePostParams>,
  res: Response,
) => {
  try {
    await postsService.delete(req.params.id);

    res.sendStatus(EHttpStatus.NO_CONTENT_204);
  } catch (error: unknown) {
    errorsHandler(error, res);
  }
};
