import { Response } from 'express';
import { EHttpStatus } from '../../../core/constants/http';
import { TRequestWithParamsAndBody } from '../../../core/types/request';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { TPostUpdateInput } from '../input/post-update.input';
import { TDeletePostParams } from './params/delete-post-params';
import { postsService } from '../../application/posts.service';

export const updatePostHandler = async (
  req: TRequestWithParamsAndBody<TDeletePostParams, TPostUpdateInput>,
  res: Response,
) => {
  try {
    await postsService.update(req.params.id, req.body);

    res.sendStatus(EHttpStatus.NO_CONTENT_204);
  } catch (error: unknown) {
    errorsHandler(error, res);
  }
};
