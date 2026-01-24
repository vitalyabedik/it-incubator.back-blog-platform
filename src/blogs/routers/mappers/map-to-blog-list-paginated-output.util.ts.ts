import { TPaginationMeta } from '../../../core/types/pagination-and-sorting';
import { TBlogQueryRepositoryOutput } from '../../repositories/output/blog-query-repository.output';
import { TBlogListPaginatedOutput } from '../output/blog-list-paginated.output';

export const mapToBlogListPaginatedOutput = (
  blogs: TBlogQueryRepositoryOutput[],
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

    items: blogs.map((blog) => ({
      id: blog._id.toString(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt,
      isMembership: blog.isMembership,
    })),
  };
};
