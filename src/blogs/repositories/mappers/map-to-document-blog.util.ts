import { TBlog } from '../../types/blog.types';
import { TBlogCreateInput } from '../../routers/input/blog-create.input';

export const mapToDocumentBlog = (dto: TBlogCreateInput): TBlog => ({
  name: dto.name,
  description: dto.description,
  websiteUrl: dto.websiteUrl,
  createdAt: new Date(),
  isMembership: false,
});
