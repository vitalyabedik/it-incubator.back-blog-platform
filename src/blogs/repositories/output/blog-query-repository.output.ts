import { WithId } from 'mongodb';
import { TBlogDB } from '../../domain/blogDB';

export type TBlogQueryRepositoryOutput = WithId<TBlogDB>;
