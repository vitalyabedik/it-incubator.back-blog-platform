import { Response } from 'express';
import { TRequestWithBody } from '../../../core/types/request';
import { EHttpStatus } from '../../../core/constants/http';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { blogsService } from '../../application/blogs.service';
import { TBlogCreateInput } from '../input/blog-create.input';
import { blogsQueryRepository } from '../../repositories/blogs-query.repositories';

export const createBlogHandler = async (
  req: TRequestWithBody<TBlogCreateInput>,
  res: Response,
) => {
  try {
    const createdBlogId = await blogsService.create(req.body);

    const createdBlog = await blogsQueryRepository.getBlogById(createdBlogId);

    res.status(EHttpStatus.CREATED_201).send(createdBlog);
  } catch (error: unknown) {
    errorsHandler(error, res);
  }
};
