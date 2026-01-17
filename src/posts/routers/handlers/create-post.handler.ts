import { Response } from 'express';
import { blogsRepository } from '../../../blogs/repositories/blogs.repositories';
import { TRequestWithBody } from '../../../core/types/request';
import { EHttpStatus } from '../../../core/constants/http';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { TPostInputDto } from '../../dto/posts.input-dto';
import { postsRepository } from '../../repositories/posts.repositories';
import { TPost } from '../../types';
import { mapToPostViewModel } from '../mappers/map-to-post-view-model.util';

export const createPostHandler = async (
  req: TRequestWithBody<TPostInputDto>,
  res: Response,
) => {
  try {
    const { blogId, content, shortDescription, title } = req.body;

    const blog = await blogsRepository.getBlogById(blogId);

    const newPost: TPost = {
      blogName: String(blog.name),
      blogId,
      content,
      shortDescription,
      title,
      createdAt: new Date().toISOString(),
    };

    const createdPost = await postsRepository.create(newPost);

    const postViewModel = mapToPostViewModel(createdPost);

    res.status(EHttpStatus.CREATED_201).send(postViewModel);
  } catch (error: unknown) {
    errorsHandler(error, res);
  }
};
