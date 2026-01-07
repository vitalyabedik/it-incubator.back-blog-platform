import { TBlogView } from '../types';

export type TBlogInputDto = Omit<TBlogView, 'id'>;
