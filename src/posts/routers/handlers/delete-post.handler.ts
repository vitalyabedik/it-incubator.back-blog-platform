import { Response } from 'express';
import { EHttpStatus } from '../../../core/constants/http';
import { TRequestWithParams } from '../../../core/types/request';
import { postsRepository } from '../../repositories/posts.repositories';
import { TDeletePostParams } from '../../types';

export const deletePostHandler = (
  req: TRequestWithParams<TDeletePostParams>,
  res: Response,
) => {
  const postId = req.params.id;
  const post = postsRepository.findById(postId);

  if (!post) {
    res.sendStatus(EHttpStatus.NotFound_404);
    return;
  }

  postsRepository.delete(postId);
  res.sendStatus(EHttpStatus.NoContent_204);
};
