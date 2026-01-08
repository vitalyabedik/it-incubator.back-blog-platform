import { Response } from 'express';
import { blogsRepository } from '../../repositories/blogs.repositories';
import { TRequestWithBody } from '../../../core/types/request';
import { EHttpStatus } from '../../../core/constants/http';
import { TBlogInputDto } from '../../dto/blogs.input-dto';
import { TBlogView } from '../../types';

export const createBlogHandler = (
  req: TRequestWithBody<TBlogInputDto>,
  res: Response,
) => {
  const { name, description, websiteUrl } = req.body;

  const newBlog: TBlogView = {
    id: crypto.randomUUID(),
    name,
    description,
    websiteUrl,
  };

  blogsRepository.create(newBlog);
  res.status(EHttpStatus.Created_201).send(newBlog);
};
