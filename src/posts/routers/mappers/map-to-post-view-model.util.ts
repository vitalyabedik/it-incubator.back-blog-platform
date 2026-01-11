import { WithId } from 'mongodb';
import { TPost, TPostViewModel } from '../../types';

export const mapToPostViewModel = (post: WithId<TPost>): TPostViewModel => ({
  id: post._id.toString(),
  blogId: post.blogId,
  blogName: post.blogName,
  title: post.title,
  content: post.content,
  shortDescription: post.shortDescription,
  createdAt: post.createdAt,
});
