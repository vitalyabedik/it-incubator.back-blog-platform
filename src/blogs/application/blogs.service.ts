import { inject, injectable } from 'inversify';
import { BlogsRepository } from '../repositories/blogs.repositories';
import { TBlogCreateInput } from '../routers/input/blog-create.input';
import { TBlogUpdateInput } from '../routers/input/blog-update.input';
import { BlogModel } from '../model/blog.model';

@injectable()
export class BlogsService {
  constructor(
    @inject(BlogsRepository)
    private blogsRepository: BlogsRepository,
  ) {}

  async create(dto: TBlogCreateInput): Promise<string> {
    const newDocumentBlog = await BlogModel.createBlogInstance(dto);

    await this.blogsRepository.saveBlog(newDocumentBlog);

    return newDocumentBlog._id.toString();
  }

  async update(id: string, dto: TBlogUpdateInput): Promise<void> {
    const blog = await this.blogsRepository.findBlogById(id);

    const updatedBlog = blog.updateBlog(dto);

    await this.blogsRepository.saveBlog(updatedBlog);
  }

  async delete(id: string): Promise<void> {
    await this.blogsRepository.delete(id);
  }
}
