import { Response } from 'express';
import { blogsRepository } from '../../repositories/blogs.repositories';
import { TRequestWithParams } from '../../../core/types/request';
import { EHttpStatus } from '../../../core/constants/http';
import { TDeleteBlogParams } from '../../types';

export const deleteBlogHandler = (
  req: TRequestWithParams<TDeleteBlogParams>,
  res: Response,
) => {
  const blogId = req.params.id;
  const blog = blogsRepository.findById(blogId);

  if (!blog) {
    res.sendStatus(EHttpStatus.NOT_FOUND_404);
    return;
  }

  blogsRepository.delete(blogId);
  res.sendStatus(EHttpStatus.NO_CONTENT_204);
};
