import { TPostOutput } from '../output/post.output';
import { TPostRepositoryOutput } from '../../repositories/output/post-repository.output';

export const mapToPostOutput = (post: TPostRepositoryOutput): TPostOutput => ({
  id: post._id.toString(),
  blogId: post.blogId,
  blogName: post.blogName,
  title: post.title,
  content: post.content,
  shortDescription: post.shortDescription,
  createdAt: post.createdAt,
});
