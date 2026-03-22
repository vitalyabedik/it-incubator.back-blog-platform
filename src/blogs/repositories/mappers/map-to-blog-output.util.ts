import { TBlog } from '../../model/blog.model';
import { TBlogOutput } from '../output/blog.output';

export const mapToBlogOutput = (blog: TBlog): TBlogOutput => ({
  id: blog._id.toString(),
  name: blog.name,
  description: blog.description,
  websiteUrl: blog.websiteUrl,
  createdAt: blog.createdAt.toISOString(),
  isMembership: blog.isMembership,
});
