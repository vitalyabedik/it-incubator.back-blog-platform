import { Response } from 'express';
import { TRequestWithParams } from '../../../core/types/request';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { blogsQueryRepository } from '../../repositories/blogs-query.repositories';
import { TGetBlogParams } from './params/get-blog-params';

export const getBlogHandler = async (
  req: TRequestWithParams<TGetBlogParams>,
  res: Response,
) => {
  try {
    const blog = await blogsQueryRepository.getBlogById(req.params.id);

    res.send(blog);
  } catch (error: unknown) {
    errorsHandler(error, res);
  }
};
