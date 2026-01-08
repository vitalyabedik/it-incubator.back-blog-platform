import { Response } from 'express';
import { TRequestWithParams } from '../../../core/types/request';
import { postsRepository } from '../../repositories/posts.repositories';
import { TGetPostParams } from '../../types';
import { EHttpStatus } from '../../../core/constants/http';

export const getPostHandler = (
  req: TRequestWithParams<TGetPostParams>,
  res: Response,
) => {
  const post = postsRepository.findById(req.params.id);

  if (!post) {
    res.sendStatus(EHttpStatus.NotFound_404);
    return;
  }

  res.send(post);
};
