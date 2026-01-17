import { TBlogOutput } from './../output/blog.output';

export type TBlogUpdateInput = Omit<
  TBlogOutput,
  'id' | 'createdAt' | 'isMembership'
>;
