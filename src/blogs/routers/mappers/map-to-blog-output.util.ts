import { TBlogQueryRepositoryOutput } from '../../repositories/output/blog-query-repository.output';
import { TBlogOutput } from '../output/blog.output';

export const mapToBlogOutput = (
  blog: TBlogQueryRepositoryOutput,
): TBlogOutput => ({
  id: blog._id.toString(),
  name: blog.name,
  description: blog.description,
  websiteUrl: blog.websiteUrl,
  createdAt: blog.createdAt,
  isMembership: blog.isMembership,
});
