import { TPost } from '../../model/post.model';
import { TPostOutput } from '../output/post.output';

export const mapToPostOutput = (post: TPost): TPostOutput => ({
  id: post._id.toString(),
  blogId: post.blogId,
  blogName: post.blogName,
  title: post.title,
  content: post.content,
  shortDescription: post.shortDescription,
  createdAt: post.createdAt.toISOString(),
});
