import { Response } from 'express';
import { blogsRepository } from '../../repositories/blogs.repositories';
import { TRequestWithParams } from '../../../core/types/request';
import { EHttpStatus } from '../../../core/constants/http';
import { TDeleteBlogParams } from '../../types';

export const deleteBlogHandler = (
  req: TRequestWithParams<TDeleteBlogParams>,
  res: Response,
) => {
  const blog = blogsRepository.findById(req.params.id);

  if (!blog) {
    res.sendStatus(EHttpStatus.NotFound_404);
    return;
  }

  blogsRepository.delete(req.params.id);
  res.sendStatus(EHttpStatus.NoContent_204);
};
