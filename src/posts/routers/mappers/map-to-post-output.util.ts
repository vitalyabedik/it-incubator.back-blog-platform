import { TPostOutput } from '../output/post.output';
import { TPostQueryRepositoryOutput } from '../../repositories/output/post-query-repository.output';

export const mapToPostOutput = (
  post: TPostQueryRepositoryOutput,
): TPostOutput => ({
  id: post._id.toString(),
  blogId: post.blogId,
  blogName: post.blogName,
  title: post.title,
  content: post.content,
  shortDescription: post.shortDescription,
  createdAt: post.createdAt,
});
