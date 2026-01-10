import { Response } from 'express';
import { blogsRepository } from '../../../blogs/repositories/blogs.repositories';
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

  const blog = blogsRepository.findById(blogId)!;

  const { name } = blog;
  const newPost: TPostView = {
    id: crypto.randomUUID(),
    blogName: name,
    blogId,
    content,
    shortDescription,
    title,
  };

  postsRepository.create(newPost);
  res.status(EHttpStatus.CREATED_201).send(newPost);
};
