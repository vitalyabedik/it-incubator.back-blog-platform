import { Response } from 'express';
import { TRequestWithParams } from '../../../core/types/request';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { blogsService } from '../../application/blogs.service';
import { mapToBlogOutput } from '../mappers/map-to-blog-output.util';
import { TGetBlogParams } from './params/get-blog-params';

export const getBlogHandler = async (
  req: TRequestWithParams<TGetBlogParams>,
  res: Response,
) => {
  try {
    const blog = await blogsService.getBlogById(req.params.id);

    const blogOutput = mapToBlogOutput(blog);

    res.send(blogOutput);
  } catch (error: unknown) {
    errorsHandler(error, res);
  }
};
