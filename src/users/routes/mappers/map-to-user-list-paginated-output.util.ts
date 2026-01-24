import { TPaginationMeta } from '../../../core/types/pagination-and-sorting';
import { TUserQueryRepositoryOutput } from '../../repositories/output/user-query-repository.output';
import { TUserListPaginatedOutput } from '../output/user-list-paginated.output';

export const mapToUserListPaginatedOutput = (
  users: TUserQueryRepositoryOutput[],
  meta: {
    pagination: TPaginationMeta;
  },
): TUserListPaginatedOutput => {
  const { page, pageSize, totalCount } = meta.pagination;

  return {
    page: page,
    pageSize: pageSize,
    pagesCount: Math.ceil(totalCount / pageSize),
    totalCount: totalCount,

    items: users.map((user) => ({
      id: user._id.toString(),
      login: user.login,
      email: user.email,
      createdAt: user.createdAt,
    })),
  };
};
