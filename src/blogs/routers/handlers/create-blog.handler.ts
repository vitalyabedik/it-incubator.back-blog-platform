import { Response } from 'express';
import { blogsRepository } from '../../repositories/blogs.repositories';
import { TRequestWithBody } from '../../../core/types/request';
import { EHttpStatus } from '../../../core/constants/http';
import { TBlogInputDto } from '../../dto/blogs.input-dto';
import { TBlog } from '../../types';
import { mapToBlogViewModel } from '../mappers/map-to-blog-view-model.util';

export const createBlogHandler = async (
  req: TRequestWithBody<TBlogInputDto>,
  res: Response,
) => {
  try {
    const { name, description, websiteUrl } = req.body;

    const newBlog: TBlog = {
      name,
      description,
      websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false,
    };

    const createdBlog = await blogsRepository.create(newBlog);
    const blogViewModel = mapToBlogViewModel(createdBlog);
    res.status(EHttpStatus.CREATED_201).send(blogViewModel);
  } catch (error: unknown) {
    console.log(error);

    res.sendStatus(EHttpStatus.INTERNAL_SERVER_ERROR_500);
  }
};
