import { Request, Response } from 'express';
import { postsRepository } from '../../repositories/posts.repositories';

export const getPostListHandler = (_: Request, res: Response) => {
  const posts = postsRepository.findAll();
  res.send(posts);
};
