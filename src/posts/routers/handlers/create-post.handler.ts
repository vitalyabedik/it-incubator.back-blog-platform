import { Response } from 'express';
import { TRequestWithBody } from '../../../core/types/request';
import { EHttpStatus } from '../../../core/constants/http';
import { TPostInputDto } from '../../dto/posts.input-dto';
import { postsRepository } from '../../repositories/posts.repositories';
import { TPostView } from '../../types';

export const createPostHandler = (
  req: TRequestWithBody<TPostInputDto>,
  res: Response,
) => {
  const { blogId, content, shortDescription, title } = req.body;

  const newPost: TPostView = {
    id: crypto.randomUUID(),
    blogName: '',
    blogId,
    content,
    shortDescription,
    title,
  };

  postsRepository.create(newPost);
  res.status(EHttpStatus.Created_201).send(newPost);
};
