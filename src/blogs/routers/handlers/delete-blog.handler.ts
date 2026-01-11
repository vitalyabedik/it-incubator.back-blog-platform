import { Response } from 'express';
import { blogsRepository } from '../../repositories/blogs.repositories';
import { TRequestWithParams } from '../../../core/types/request';
import { EHttpStatus } from '../../../core/constants/http';
import { TDeleteBlogParams } from '../../types';

export const deleteBlogHandler = async (
  req: TRequestWithParams<TDeleteBlogParams>,
  res: Response,
) => {
  try {
    const blogId = req.params.id;
    const blog = await blogsRepository.findById(blogId);

    if (!blog) {
      res.sendStatus(EHttpStatus.NOT_FOUND_404);
      return;
    }

    await blogsRepository.delete(blogId);
    res.sendStatus(EHttpStatus.NO_CONTENT_204);
  } catch (error: unknown) {
    console.log(error);

    res.sendStatus(EHttpStatus.INTERNAL_SERVER_ERROR_500);
  }
};
