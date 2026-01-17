import { Response } from 'express';
import { matchedData } from 'express-validator';
import { TRequestWithQuery } from '../../../core/types/request';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { setDefaultSortAndPaginationIfNotExist } from '../../../core/utils/set-default-sort-and-pagination';
import { blogsService } from '../../application/blogs.service';
import { TBlogQueryInput } from '../input/blog-query.input';
import { mapToBlogListPaginatedOutput } from '../mappers/map-to-blog-list-paginated-output.util.ts';

export const getBlogListHandler = async (
  req: TRequestWithQuery<TBlogQueryInput>,
  res: Response,
) => {
  try {
    const sanitizedQuery = matchedData<TBlogQueryInput>(req, {
      locations: ['query'],
      includeOptionals: true,
    });
    const queryInput = setDefaultSortAndPaginationIfNotExist(sanitizedQuery);

    const { items, totalCount } = await blogsService.getBlogList(queryInput);

    const blogListOutput = mapToBlogListPaginatedOutput(items, {
      pagination: {
        page: queryInput.pageNumber,
        pageSize: queryInput.pageSize,
        totalCount,
      },
    });

    res.send(blogListOutput);
  } catch (error: unknown) {
    errorsHandler(error, res);
  }
};
