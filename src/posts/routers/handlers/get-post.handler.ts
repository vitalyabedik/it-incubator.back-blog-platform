import { Response } from 'express';
import { TRequestWithParams } from '../../../core/types/request';
import { EHttpStatus } from '../../../core/constants/http';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { postsRepository } from '../../repositories/posts.repositories';
import { TGetPostParams } from '../../types';
import { mapToPostViewModel } from '../mappers/map-to-post-view-model.util';

export const getPostHandler = async (
  req: TRequestWithParams<TGetPostParams>,
  res: Response,
) => {
  try {
    const post = await postsRepository.findById(req.params.id);

    if (!post) {
      res.sendStatus(EHttpStatus.NOT_FOUND_404);
      return;
    }

    const postViewModel = mapToPostViewModel(post);
    res.send(postViewModel);
  } catch (error: unknown) {
    errorsHandler(error, res);
  }
};
