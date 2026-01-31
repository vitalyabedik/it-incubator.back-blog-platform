import { TPostCreateInput } from '../../routers/input/post-create.input';
import { TPostDB } from '../../domain/postDB';
import { TBlogOutput } from '../../../blogs/repositories/output/blog.output';

type TArgs = {
  blogId: string;
  blog: TBlogOutput;
  dto: TPostCreateInput;
};

export const mapToDbPost = ({ blogId, blog, dto }: TArgs): TPostDB => ({
  blogId,
  blogName: blog.name,
  content: dto.content,
  shortDescription: dto.shortDescription,
  title: dto.title,
  createdAt: new Date().toISOString(),
});
