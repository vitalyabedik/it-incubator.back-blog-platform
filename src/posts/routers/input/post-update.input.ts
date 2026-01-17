import { TPostOutput } from '../output/post.output';

export type TPostUpdateInput = Omit<
  TPostOutput,
  'id' | 'blogName' | 'createdAt'
>;
