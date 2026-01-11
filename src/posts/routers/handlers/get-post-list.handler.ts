import { Request, Response } from 'express';
import { postsRepository } from '../../repositories/posts.repositories';
import { EHttpStatus } from '../../../core/constants/http';
import { mapToPostViewModel } from '../mappers/map-to-post-view-model.util';

export const getPostListHandler = async (_: Request, res: Response) => {
  try {
    const posts = await postsRepository.findAll();
    const postsViewModel = posts.map(mapToPostViewModel);
    res.send(postsViewModel);
  } catch (error: unknown) {
    console.log(error);

    res.sendStatus(EHttpStatus.INTERNAL_SERVER_ERROR_500);
  }
};
