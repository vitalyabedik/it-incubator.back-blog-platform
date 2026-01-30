import { blogsQueryRepository } from '../../blogs/repositories/blogs-query.repositories';
import { TPost } from '../domain/post';
import { postsRepository } from '../repositories/posts.repositories';
import { TPostCreateInput } from '../routers/input/post-create.input';
import { TPostUpdateInput } from '../routers/input/post-update.input';

export const postsService = {
  async create(dto: TPostCreateInput): Promise<string> {
    const { blogId, content, shortDescription, title } = dto;

    const blog = await blogsQueryRepository.getBlogById(blogId);

    const newPost: TPost = {
      blogName: blog.name,
      blogId,
      content,
      shortDescription,
      title,
      createdAt: new Date().toISOString(),
    };

    return postsRepository.create(newPost);
  },

  async createPostByBlogId(
    blogId: string,
    dto: TPostCreateInput,
  ): Promise<string> {
    const { content, shortDescription, title } = dto;

    const blog = await blogsQueryRepository.getBlogById(blogId);

    const newPost: TPost = {
      blogName: blog.name,
      blogId,
      content,
      shortDescription,
      title,
      createdAt: new Date().toISOString(),
    };

    const postId = await postsRepository.create(newPost);

    return postId;
  },

  async update(id: string, dto: TPostUpdateInput): Promise<void> {
    await postsRepository.update(id, dto);
    return;
  },

  async delete(id: string): Promise<void> {
    await postsRepository.delete(id);
    return;
  },
};
