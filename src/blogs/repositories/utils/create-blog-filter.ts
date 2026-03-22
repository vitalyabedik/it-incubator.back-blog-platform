import { QueryFilter } from 'mongoose';
import { TBlogQueryInput } from '../../routers/input/blog-query.input';
import { TBlog } from '../../model/blog.model';

type TBlogFilter = QueryFilter<TBlog> & {
  name?: {
    $regex: string;
    $options: string;
  };
};

export const createBlogFilter = (queryDto: TBlogQueryInput): TBlogFilter => {
  const { searchNameTerm } = queryDto;
  const filter: TBlogFilter = {};

  if (searchNameTerm) {
    filter.name = { $regex: searchNameTerm, $options: 'i' };
  }

  return filter;
};
