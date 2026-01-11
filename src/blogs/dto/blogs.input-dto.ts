import { TBlogViewModel } from '../types';

export type TBlogInputDto = Omit<
  TBlogViewModel,
  'id' | 'createdAt' | 'isMembership'
>;
