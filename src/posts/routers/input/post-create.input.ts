import { TPostOutput } from '../output/post.output';

export type TPostCreateInput = Omit<
  TPostOutput,
  'id' | 'blogName' | 'createdAt'
>;
