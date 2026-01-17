import { TBlogOutput } from '../output/blog.output';

export type TBlogCreateInput = Omit<
  TBlogOutput,
  'id' | 'createdAt' | 'isMembership'
>;
