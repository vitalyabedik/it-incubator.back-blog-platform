import { Response } from 'express';
import { TRequestWithParams } from '../../../core/types/request';
import { postsRepository } from '../../repositories/posts.repositories';
import { TGetPostParams } from '../../types';
import { EHttpStatus } from '../../../core/constants/http';
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
    console.log(error);

    res.sendStatus(EHttpStatus.INTERNAL_SERVER_ERROR_500);
  }
};
