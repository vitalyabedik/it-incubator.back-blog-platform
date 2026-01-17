import { blogsRepository } from '../../blogs/repositories/blogs.repositories';
import { TPost } from '../domain/post';
import { TPostQueryInput } from '../routers/input/post-query.input';
import { TPostListRepositoryOutput } from '../repositories/output/post-list-repository.output';
import { postsRepository } from '../repositories/posts.repositories';
import { TPostRepositoryOutput } from '../repositories/output/post-repository.output';
import { TPostCreateInput } from '../routers/input/post-create.input';
import { TPostUpdateInput } from '../routers/input/post-update.input';

export const postsService = {
  async getPostList(
    queryDto: TPostQueryInput,
  ): Promise<TPostListRepositoryOutput> {
    return postsRepository.getPostList(queryDto);
  },

  async getPostById(id: string): Promise<TPostRepositoryOutput> {
    return postsRepository.getPostById(id);
  },

  async create(dto: TPostCreateInput): Promise<string> {
    const { blogId, content, shortDescription, title } = dto;

    const blog = await blogsRepository.getBlogById(blogId);

    const newPost: TPost = {
      blogName: String(blog.name),
      blogId,
      content,
      shortDescription,
      title,
      createdAt: new Date().toISOString(),
    };

    return postsRepository.create(newPost);
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
