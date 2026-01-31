import { TBlogDB } from '../../domain/blogDB';
import { TBlogCreateInput } from '../../routers/input/blog-create.input';

export const mapToDbBlog = (dto: TBlogCreateInput): TBlogDB => ({
  name: dto.name,
  description: dto.description,
  websiteUrl: dto.websiteUrl,
  createdAt: new Date().toISOString(),
  isMembership: false,
});
