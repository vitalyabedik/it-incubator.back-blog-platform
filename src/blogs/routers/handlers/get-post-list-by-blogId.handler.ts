import { Response } from 'express';
import { matchedData } from 'express-validator';
import { TRequestWithParamsAndQuery } from '../../../core/types/request';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { TPostQueryInput } from '../../../posts/routers/input/post-query.input';
import { TGetPostListByBlogIdParams } from './params/get-post-list-by-blogId-params';
import { mapToPostListPaginatedOutput } from '../../../posts/routers/mappers/map-to-post-list-paginated-output.util copy';
import { postsService } from '../../../posts/application/posts.service';

export const getPostListByBlogIdHandler = async (
  req: TRequestWithParamsAndQuery<TGetPostListByBlogIdParams, TPostQueryInput>,
  res: Response,
) => {
  try {
    const query = matchedData<TPostQueryInput>(req, {
      locations: ['query'],
      includeOptionals: true,
    });

    const { items, totalCount } = await postsService.getPostListByBlogId(
      req.params.blogId,
      query,
    );

    const postListOutput = mapToPostListPaginatedOutput(items, {
      pagination: {
        page: query.pageNumber,
        pageSize: query.pageSize,
        totalCount,
      },
    });

    res.send(postListOutput);
  } catch (error: unknown) {
    errorsHandler(error, res);
  }
};
