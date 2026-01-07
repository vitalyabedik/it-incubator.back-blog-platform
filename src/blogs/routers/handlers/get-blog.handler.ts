import { Response } from 'express';
import { blogsRepository } from '../../repositories/blogs.repositories';
import { TRequestWithParams } from '../../../core/types/request';
import { EHttpStatus } from '../../../core/constants/http';
import { TGetBlogParams } from '../../types';

export const getBlogHandler = (
  req: TRequestWithParams<TGetBlogParams>,
  res: Response,
) => {
  const blog = blogsRepository.findById(req.params.id);

  if (!blog) {
    res.sendStatus(EHttpStatus.NotFound_404);
    return;
  }

  res.send(blog);
};
