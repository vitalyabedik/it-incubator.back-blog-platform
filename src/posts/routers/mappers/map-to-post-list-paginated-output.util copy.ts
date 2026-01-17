import { TPaginationMeta } from '../../../core/types/pagination-and-sorting';
import { TPostRepositoryOutput } from '../../repositories/output/post-repository.output';
import { TPostListPaginatedOutput } from '../output/post-list-paginated.output';

export const mapToPostListPaginatedOutput = (
  posts: TPostRepositoryOutput[],
  meta: {
    pagination: TPaginationMeta;
  },
): TPostListPaginatedOutput => {
  const { page, pageSize, totalCount } = meta.pagination;

  return {
    page: page,
    pageSize: pageSize,
    pageCount: Math.ceil(totalCount / pageSize),
    totalCount: totalCount,

    items: posts.map((post) => ({
      id: post._id.toString(),
      blogId: post.blogId,
      blogName: post.blogName,
      title: post.title,
      content: post.content,
      shortDescription: post.shortDescription,
      createdAt: post.createdAt,
    })),
  };
};
