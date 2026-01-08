import { Response } from 'express';
import { EHttpStatus } from '../../../core/constants/http';
import { TRequestWithParamsAndBody } from '../../../core/types/request';
import { postsRepository } from '../../repositories/posts.repositories';
import { TDeletePostParams } from '../../types';
import { TPostInputDto } from '../../dto/posts.input-dto';

export const updatePostHandler = (
  req: TRequestWithParamsAndBody<TDeletePostParams, TPostInputDto>,
  res: Response,
) => {
  const postId = req.params.id;
  const post = postsRepository.findById(postId);

  if (!post) {
    res.sendStatus(EHttpStatus.NotFound_404);
    return;
  }

  postsRepository.update(postId, req.body);
  res.sendStatus(EHttpStatus.NoContent_204);
};
