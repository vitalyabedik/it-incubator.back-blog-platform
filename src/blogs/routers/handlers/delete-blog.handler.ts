import { Response } from 'express';
import { TRequestWithParams } from '../../../core/types/request';
import { EHttpStatus } from '../../../core/constants/http';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { blogsService } from '../../application/blogs.service';
import { TDeleteBlogParams } from './params/delete-blog-params';

export const deleteBlogHandler = async (
  req: TRequestWithParams<TDeleteBlogParams>,
  res: Response,
) => {
  try {
    await blogsService.delete(req.params.id);

    res.sendStatus(EHttpStatus.NO_CONTENT_204);
  } catch (error: unknown) {
    errorsHandler(error, res);
  }
};
