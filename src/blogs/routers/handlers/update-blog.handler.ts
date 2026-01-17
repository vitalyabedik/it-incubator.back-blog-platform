import { Response } from 'express';
import { TRequestWithParamsAndBody } from '../../../core/types/request';
import { EHttpStatus } from '../../../core/constants/http';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { blogsService } from '../../application/blogs.service';
import { TBlogUpdateInput } from '../input/blog-update.input';
import { TUpdateBlogParams } from './params/update-blog-params';

export const updateBlogHandler = async (
  req: TRequestWithParamsAndBody<TUpdateBlogParams, TBlogUpdateInput>,
  res: Response,
) => {
  try {
    await blogsService.update(req.params.id, req.body);

    res.sendStatus(EHttpStatus.NO_CONTENT_204);
  } catch (error: unknown) {
    errorsHandler(error, res);
  }
};
