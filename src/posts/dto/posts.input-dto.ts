import { TPostViewModel } from '../types';

export type TPostInputDto = Omit<
  TPostViewModel,
  'id' | 'blogName' | 'createdAt'
>;
