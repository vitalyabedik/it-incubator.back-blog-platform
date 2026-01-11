import { Response } from 'express';
import { EHttpStatus } from '../../../core/constants/http';
import { TRequestWithParamsAndBody } from '../../../core/types/request';
import { postsRepository } from '../../repositories/posts.repositories';
import { TDeletePostParams } from '../../types';
import { TPostInputDto } from '../../dto/posts.input-dto';

export const updatePostHandler = async (
  req: TRequestWithParamsAndBody<TDeletePostParams, TPostInputDto>,
  res: Response,
) => {
  try {
    const postId = req.params.id;
    const post = await postsRepository.findById(postId);

    if (!post) {
      res.sendStatus(EHttpStatus.NOT_FOUND_404);
      return;
    }

    await postsRepository.update(postId, req.body);
    res.sendStatus(EHttpStatus.NO_CONTENT_204);
  } catch (error: unknown) {
    console.log(error);

    res.sendStatus(EHttpStatus.INTERNAL_SERVER_ERROR_500);
  }
};
