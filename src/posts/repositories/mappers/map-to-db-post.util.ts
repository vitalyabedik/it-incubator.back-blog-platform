import { TPostCreateInput } from '../../routers/input/post-create.input';
import { TBlogOutput } from '../../../blogs/repositories/output/blog.output';
import { TPost } from '../../model/post.model';

type TArgs = {
  blogId: string;
  blog: TBlogOutput;
  dto: TPostCreateInput;
};

export const mapToDbPost = ({
  blogId,
  blog,
  dto,
}: TArgs): Omit<TPost, '_id'> => ({
  blogId,
  blogName: blog.name,
  content: dto.content,
  shortDescription: dto.shortDescription,
  title: dto.title,
  createdAt: new Date(),
});
