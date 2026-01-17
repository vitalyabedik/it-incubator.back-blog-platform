import { Request, Response } from 'express';
import { postsRepository } from '../../repositories/posts.repositories';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { mapToPostViewModel } from '../mappers/map-to-post-view-model.util';

export const getPostListHandler = async (_: Request, res: Response) => {
  try {
    const posts = await postsRepository.findAll();
    const postsViewModel = posts.map(mapToPostViewModel);
    res.send(postsViewModel);
  } catch (error: unknown) {
    errorsHandler(error, res);
  }
};
