import { Response } from 'express';
import { blogsRepository } from '../../repositories/blogs.repositories';
import { TRequestWithParamsAndBody } from '../../../core/types/request';
import { EHttpStatus } from '../../../core/constants/http';
import { TBlogInputDto } from '../../dto/blogs.input-dto';
import { TUpdateBlogParams } from '../../types';

export const updateBlogHandler = (
  req: TRequestWithParamsAndBody<TUpdateBlogParams, TBlogInputDto>,
  res: Response,
) => {
  const blogId = req.params.id;
  const blog = blogsRepository.findById(blogId);

  if (!blog) {
    res.sendStatus(EHttpStatus.NotFound_404);
    return;
  }

  blogsRepository.update(blogId, req.body);
  res.sendStatus(EHttpStatus.NoContent_204);
};
