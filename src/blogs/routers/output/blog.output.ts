import { TBlog } from '../../domain/blog';

export type TBlogOutput = TBlog & {
  id: string;
};
