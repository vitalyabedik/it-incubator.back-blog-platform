import { TPostCreateInput } from '../../routers/input/post-create.input';
import { TPost } from '../../types/post.types';

type TArgs = {
  blogName: string;
  dto: TPostCreateInput;
};

export const mapToDocumentPost = ({ blogName, dto }: TArgs): TPost => ({
  blogId: dto.blogId,
  blogName: blogName,
  title: dto.title,
  shortDescription: dto.shortDescription,
  content: dto.content,
  createdAt: new Date(),
  extendedLikesInfo: {
    likesCount: 0,
    dislikesCount: 0,
  },
});
