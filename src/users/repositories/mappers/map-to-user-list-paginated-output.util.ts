import { TPaginationMeta } from '../../../core/types/pagination-and-sorting';
import { TUserListPaginatedOutput } from '../output/user-list-paginated.output';
import { TUserMapInput } from '../../model/user.model';
import { mapToUserOutput } from './map-to-user-output.util';

export const mapToUserListPaginatedOutput = (
  users: TUserMapInput[],
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

    items: users.map(mapToUserOutput),
  };
};
