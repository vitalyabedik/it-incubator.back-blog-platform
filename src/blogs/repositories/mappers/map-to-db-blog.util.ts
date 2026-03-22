import { TBlog } from '../../model/blog.model';
import { TBlogCreateInput } from '../../routers/input/blog-create.input';

export const mapToDbBlog = (dto: TBlogCreateInput): Omit<TBlog, '_id'> => ({
  name: dto.name,
  description: dto.description,
  websiteUrl: dto.websiteUrl,
  createdAt: new Date(),
  isMembership: false,
});
