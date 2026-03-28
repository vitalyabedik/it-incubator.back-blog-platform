import { Types } from 'mongoose';
import { TPaginationMeta } from '../../../core/types/pagination-and-sorting';
import { TBlog } from '../../types/blog.types';
import { TBlogListPaginatedOutput } from '../output/blog-list-paginated.output';
import { mapToBlogOutput } from './map-to-blog-output.util';

export const mapToBlogListPaginatedOutput = (
  blogs: ({ _id: Types.ObjectId } & TBlog)[],
  meta: {
    pagination: TPaginationMeta;
  },
): TBlogListPaginatedOutput => {
  const { page, pageSize, totalCount } = meta.pagination;

  return {
    page: page,
    pageSize: pageSize,
    pagesCount: Math.ceil(totalCount / pageSize),
    totalCount: totalCount,

    items: blogs.map(mapToBlogOutput),
  };
};
