import { Request, Response } from 'express';
import { blogsRepository } from '../../repositories/blogs.repositories';

export const getBlogListHandler = (_: Request, res: Response) => {
  const blogs = blogsRepository.findAll();
  res.send(blogs);
};
