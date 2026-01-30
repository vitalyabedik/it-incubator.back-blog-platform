import { blogsRepository } from '../repositories/blogs.repositories';
import { TBlogCreateInput } from '../routers/input/blog-create.input';
import { TBlogUpdateInput } from '../routers/input/blog-update.input';
import { TBlog } from '../domain/blog';

export const blogsService = {
  async create(dto: TBlogCreateInput): Promise<string> {
    const { name, description, websiteUrl } = dto;

    const newBlog: TBlog = {
      name,
      description,
      websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false,
    };

    return blogsRepository.create(newBlog);
  },

  async update(id: string, dto: TBlogUpdateInput): Promise<void> {
    await blogsRepository.update(id, dto);
    return;
  },

  async delete(id: string): Promise<void> {
    await blogsRepository.delete(id);
    return;
  },
};
