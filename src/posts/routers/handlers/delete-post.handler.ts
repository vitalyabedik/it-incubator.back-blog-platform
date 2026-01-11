import { Response } from 'express';
import { EHttpStatus } from '../../../core/constants/http';
import { TRequestWithParams } from '../../../core/types/request';
import { postsRepository } from '../../repositories/posts.repositories';
import { TDeletePostParams } from '../../types';

export const deletePostHandler = async (
  req: TRequestWithParams<TDeletePostParams>,
  res: Response,
) => {
  try {
    const postId = req.params.id;
    const post = await postsRepository.findById(postId);

    if (!post) {
      res.sendStatus(EHttpStatus.NOT_FOUND_404);
      return;
    }

    await postsRepository.delete(postId);
    res.sendStatus(EHttpStatus.NO_CONTENT_204);
  } catch (error: unknown) {
    console.log(error);

    res.sendStatus(EHttpStatus.INTERNAL_SERVER_ERROR_500);
  }
};
