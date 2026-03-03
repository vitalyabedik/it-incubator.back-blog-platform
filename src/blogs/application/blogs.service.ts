import { inject, injectable } from 'inversify';
import { BlogsRepository } from '../repositories/blogs.repositories';
import { TBlogCreateInput } from '../routers/input/blog-create.input';
import { TBlogUpdateInput } from '../routers/input/blog-update.input';
import { mapToDbBlog } from '../repositories/mappers/map-to-db-blog.util';

@injectable()
export class BlogsService {
  constructor(
    @inject(BlogsRepository)
    private blogsRepository: BlogsRepository,
  ) {}

  async create(dto: TBlogCreateInput): Promise<string> {
    const newDbBlog = mapToDbBlog(dto);

    return this.blogsRepository.create(newDbBlog);
  }

  async update(id: string, dto: TBlogUpdateInput): Promise<void> {
    await this.blogsRepository.update(id, dto);
    return;
  }

  async delete(id: string): Promise<void> {
    await this.blogsRepository.delete(id);
    return;
  }
}
