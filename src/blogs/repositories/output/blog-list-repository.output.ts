import { TBlogRepositoryOutput } from './blog-repository.output';

export type TBlogListRepositoryOutput = {
  items: TBlogRepositoryOutput[];
  totalCount: number;
};
