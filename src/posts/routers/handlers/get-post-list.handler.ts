import { postsService } from './../../application/posts.service';
import { matchedData } from 'express-validator';
import { Response } from 'express';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { TRequestWithQuery } from '../../../core/types/request';
import { setDefaultSortAndPagination } from '../../../core/utils/set-default-sort-and-pagination';
import { TPostQueryInput } from '../input/post-query.input';
import { mapToPostListPaginatedOutput } from '../mappers/map-to-post-list-paginated-output.util copy';

export const getPostListHandler = async (
  req: TRequestWithQuery<TPostQueryInput>,
  res: Response,
) => {
  try {
    const sanitizedQuery = matchedData<TPostQueryInput>(req, {
      locations: ['query'],
      includeOptionals: true,
    });
    const queryInput = setDefaultSortAndPagination(sanitizedQuery);

    const { items, totalCount } = await postsService.getPostList(queryInput);

    const postListOutput = mapToPostListPaginatedOutput(items, {
      pagination: {
        page: queryInput.pageNumber,
        pageSize: queryInput.pageSize,
        totalCount,
      },
    });

    res.send(postListOutput);
  } catch (error: unknown) {
    errorsHandler(error, res);
  }
};
