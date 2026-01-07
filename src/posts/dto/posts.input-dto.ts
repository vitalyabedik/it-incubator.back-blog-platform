import { TPostView } from '../types';

export type TPostInputDto = Omit<TPostView, 'id' | 'blogName'>;
