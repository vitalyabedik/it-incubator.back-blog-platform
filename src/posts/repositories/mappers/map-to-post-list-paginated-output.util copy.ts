import { TPaginationMeta } from '../../../core/types/pagination-and-sorting';
import { TPost } from '../../model/post.model';
import { TPostListPaginatedOutput } from '../output/post-list-paginated.output';
import { mapToPostOutput } from './map-to-post-output.util';

export const mapToPostListPaginatedOutput = (
  posts: TPost[],
  meta: {
    pagination: TPaginationMeta;
  },
): TPostListPaginatedOutput => {
  const { page, pageSize, totalCount } = meta.pagination;

  return {
    page: page,
    pageSize: pageSize,
    pagesCount: Math.ceil(totalCount / pageSize),
    totalCount: totalCount,

    items: posts.map(mapToPostOutput),
  };
};
