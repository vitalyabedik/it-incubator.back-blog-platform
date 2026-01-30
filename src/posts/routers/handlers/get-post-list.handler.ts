import { matchedData } from 'express-validator';
import { Response } from 'express';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { TRequestWithQuery } from '../../../core/types/request';
import { setDefaultSortAndPagination } from '../../../core/utils/set-default-sort-and-pagination';
import { postsQueryRepository } from '../../repositories/posts-query.repositories';
import { TPostQueryInput } from '../input/post-query.input';

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

    const postList = await postsQueryRepository.getPostList(queryInput);

    res.send(postList);
  } catch (error: unknown) {
    errorsHandler(error, res);
  }
};
