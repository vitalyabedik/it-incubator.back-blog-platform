import { Request, Response } from 'express';
import { blogsRepository } from '../../repositories/blogs.repositories';
import { EHttpStatus } from '../../../core/constants/http';
import { mapToBlogViewModel } from '../mappers/map-to-blog-view-model.util';

export const getBlogListHandler = async (_: Request, res: Response) => {
  try {
    const blogs = await blogsRepository.findAll();
    const blogsViewModel = blogs.map(mapToBlogViewModel);
    res.send(blogsViewModel);
  } catch (error: unknown) {
    console.log(error);

    res.sendStatus(EHttpStatus.INTERNAL_SERVER_ERROR_500);
  }
};
