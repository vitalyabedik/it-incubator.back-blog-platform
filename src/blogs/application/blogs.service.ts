import { blogsRepository } from '../repositories/blogs.repositories';
import { TBlogCreateInput } from '../routers/input/blog-create.input';
import { TBlogUpdateInput } from '../routers/input/blog-update.input';
import { mapToDbBlog } from '../repositories/mappers/map-to-db-blog.util';

export const blogsService = {
  async create(dto: TBlogCreateInput): Promise<string> {
    const newDbBlog = mapToDbBlog(dto);

    return blogsRepository.create(newDbBlog);
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
