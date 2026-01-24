import { WithId } from 'mongodb';
import { TBlog } from '../../domain/blog';

export type TBlogQueryRepositoryOutput = WithId<TBlog>;
