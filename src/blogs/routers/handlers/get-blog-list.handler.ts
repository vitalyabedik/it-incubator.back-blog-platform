import { Response } from 'express';
import { matchedData } from 'express-validator';
import { TRequestWithQuery } from '../../../core/types/request';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { setDefaultSortAndPagination } from '../../../core/utils/set-default-sort-and-pagination';
import { blogsQueryRepository } from '../../repositories/blogs-query.repositories';
import { TBlogQueryInput } from '../input/blog-query.input';
import { setDefaultBlogFilters } from './utils/set-default-blog-filters';

export const getBlogListHandler = async (
  req: TRequestWithQuery<TBlogQueryInput>,
  res: Response,
) => {
  try {
    const { searchNameTerm, ...restPaginationAndSort } =
      matchedData<TBlogQueryInput>(req, {
        locations: ['query'],
        includeOptionals: true,
      });
    const queryInput = {
      ...setDefaultSortAndPagination(restPaginationAndSort),
      ...setDefaultBlogFilters({ searchNameTerm }),
    };

    const blogList = await blogsQueryRepository.getBlogList(queryInput);

    res.send(blogList);
  } catch (error: unknown) {
    errorsHandler(error, res);
  }
};
