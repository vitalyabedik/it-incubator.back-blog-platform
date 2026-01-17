import { Filter } from 'mongodb';
import { TBlog } from '../../domain/blog';
import { TBlogQueryInput } from '../../routers/input/blog-query.input';

type TBlogFilter = Filter<TBlog> & {
  title?: {
    $regex: string;
    $options: string;
  };
};

export const createBlogFilter = (queryDto: TBlogQueryInput): TBlogFilter => {
  const { searchNameTerm } = queryDto;
  const filter: TBlogFilter = {};

  if (searchNameTerm) {
    filter.title = { $regex: searchNameTerm, $options: 'i' };
  }

  return filter;
};
