import { blogsQueryRepository } from '../../blogs/repositories/blogs-query.repositories';
import { mapToDbPost } from '../repositories/mappers/map-to-db-post.util';
import { postsRepository } from '../repositories/posts.repositories';
import { TPostCreateInput } from '../routers/input/post-create.input';
import { TPostUpdateInput } from '../routers/input/post-update.input';

export const postsService = {
  async create(dto: TPostCreateInput): Promise<string> {
    const { blogId } = dto;

    const blog = await blogsQueryRepository.getBlogById(blogId);

    const newDbPost = mapToDbPost({ blogId, blog, dto });

    return postsRepository.create(newDbPost);
  },

  async createPostByBlogId(
    blogId: string,
    dto: TPostCreateInput,
  ): Promise<string> {
    const blog = await blogsQueryRepository.getBlogById(blogId);

    const newDbPost = mapToDbPost({ blogId, blog, dto });

    const postId = await postsRepository.create(newDbPost);

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
