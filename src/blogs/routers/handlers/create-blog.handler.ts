import { Response } from 'express';
import { TRequestWithBody } from '../../../core/types/request';
import { EHttpStatus } from '../../../core/constants/http';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { blogsService } from '../../application/blogs.service';
import { mapToBlogOutput } from '../mappers/map-to-blog-output.util';
import { TBlogCreateInput } from '../input/blog-create.input';

export const createBlogHandler = async (
  req: TRequestWithBody<TBlogCreateInput>,
  res: Response,
) => {
  try {
    const createdBlogId = await blogsService.create(req.body);

    const createdBlog = await blogsService.getBlogById(createdBlogId);

    const blogOutput = mapToBlogOutput(createdBlog);

    res.status(EHttpStatus.CREATED_201).send(blogOutput);
  } catch (error: unknown) {
    errorsHandler(error, res);
  }
};
