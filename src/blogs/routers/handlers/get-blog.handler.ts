import { Response } from 'express';
import { blogsRepository } from '../../repositories/blogs.repositories';
import { TRequestWithParams } from '../../../core/types/request';
import { EHttpStatus } from '../../../core/constants/http';
import { TGetBlogParams } from '../../types';
import { mapToBlogViewModel } from '../mappers/map-to-blog-view-model.util';

export const getBlogHandler = async (
  req: TRequestWithParams<TGetBlogParams>,
  res: Response,
) => {
  try {
    const blog = await blogsRepository.findById(req.params.id);

    if (!blog) {
      res.sendStatus(EHttpStatus.NOT_FOUND_404);
      return;
    }

    const blogViewModel = mapToBlogViewModel(blog);
    res.send(blogViewModel);
  } catch (error: unknown) {
    console.log(error);

    res.sendStatus(EHttpStatus.INTERNAL_SERVER_ERROR_500);
  }
};
