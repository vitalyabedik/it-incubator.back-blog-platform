import { Response } from 'express';
import { blogsRepository } from '../../repositories/blogs.repositories';
import { TRequestWithParamsAndBody } from '../../../core/types/request';
import { EHttpStatus } from '../../../core/constants/http';
import { TBlogInputDto } from '../../dto/blogs.input-dto';
import { TUpdateBlogParams } from '../../types';

export const updateBlogHandler = async (
  req: TRequestWithParamsAndBody<TUpdateBlogParams, TBlogInputDto>,
  res: Response,
) => {
  try {
    const blogId = req.params.id;
    const blog = await blogsRepository.findById(blogId);

    if (!blog) {
      res.sendStatus(EHttpStatus.NOT_FOUND_404);
      return;
    }

    await blogsRepository.update(blogId, req.body);
    res.sendStatus(EHttpStatus.NO_CONTENT_204);
  } catch (error: unknown) {
    console.log(error);

    res.sendStatus(EHttpStatus.INTERNAL_SERVER_ERROR_500);
  }
};
