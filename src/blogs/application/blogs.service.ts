import { blogsRepository } from '../repositories/blogs.repositories';
import { TBlogQueryRepositoryOutput } from '../repositories/output/blog-query-repository.output';
import { TBlogListQueryRepositoryOutput } from '../repositories/output/blog-list-query-repository.output';
import { blogsQueryRepository } from '../repositories/blogs-query.repositories';
import { TBlogQueryInput } from '../routers/input/blog-query.input';
import { TBlogCreateInput } from '../routers/input/blog-create.input';
import { TBlogUpdateInput } from '../routers/input/blog-update.input';
import { TBlog } from '../domain/blog';

export const blogsService = {
  async getBlogList(
    queryDto: TBlogQueryInput,
  ): Promise<TBlogListQueryRepositoryOutput> {
    return blogsQueryRepository.getBlogList(queryDto);
  },

  async getBlogById(id: string): Promise<TBlogQueryRepositoryOutput> {
    return blogsQueryRepository.getBlogById(id);
  },

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
