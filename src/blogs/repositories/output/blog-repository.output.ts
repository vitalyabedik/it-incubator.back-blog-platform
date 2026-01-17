import { WithId } from 'mongodb';
import { TBlog } from '../../domain/blog';

export type TBlogRepositoryOutput = WithId<TBlog>;
