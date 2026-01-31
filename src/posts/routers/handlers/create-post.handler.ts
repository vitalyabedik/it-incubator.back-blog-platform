import { Response } from 'express';
import { TRequestWithBody } from '../../../core/types/request';
import { EHttpStatus } from '../../../core/constants/http';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { postsQueryRepository } from '../../repositories/posts-query.repositories';
import { TPostCreateInput } from '../input/post-create.input';
import { postsService } from '../../application/posts.service';

export const createPostHandler = async (
  req: TRequestWithBody<TPostCreateInput>,
  res: Response,
) => {
  try {
    const createdPostId = await postsService.create(req.body);

    const post = await postsQueryRepository.getPostById(createdPostId);

    res.status(EHttpStatus.CREATED_201).send(post);
  } catch (error: unknown) {
    errorsHandler(error, res);
  }
};
