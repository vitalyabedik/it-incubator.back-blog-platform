import { WithId } from 'mongodb';
import { TBlog, TBlogViewModel } from '../../types';

export const mapToBlogViewModel = (blog: WithId<TBlog>): TBlogViewModel => ({
  id: blog._id.toString(),
  name: blog.name,
  description: blog.description,
  websiteUrl: blog.websiteUrl,
  createdAt: blog.createdAt,
  isMembership: blog.isMembership,
});
