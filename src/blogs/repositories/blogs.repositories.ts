import { db } from '../../db/in-memory.db';
import { TBlogInputDto } from '../dto/blogs.input-dto';
import { TBlogView } from '../types';

export const blogsRepository = {
  findAll(): TBlogView[] {
    return db.blogs;
  },
  findById(id: string): TBlogView | null {
    return db.blogs.find((blog) => blog.id === id) || null;
  },
  create(newBlog: TBlogView): TBlogView {
    db.blogs.push(newBlog);
    return newBlog;
  },
  update(id: string, dto: TBlogInputDto): void {
    const blog = db.blogs.find((blog) => blog.id === id)!;

    const { name, description, websiteUrl } = dto;

    blog.name = name;
    blog.description = description;
    blog.websiteUrl = websiteUrl;
    return;
  },
  delete(id: string): void {
    const index = db.blogs.findIndex((blog) => blog.id === id);

    db.blogs.splice(index, 1);
    return;
  },
};
