import { HydratedDocument } from 'mongoose';
import { TBlogCreateInput } from '../routers/input/blog-create.input';
import { TBlogUpdateInput } from '../routers/input/blog-update.input';

export type TBlog = {
  name: string;
  description: string;
  websiteUrl: string;
  isMembership: boolean;
  createdAt: Date;
};

export type TBlogDocument = HydratedDocument<TBlog>;

export type TBlogStaticMethods = {
  createBlogInstance(dto: TBlogCreateInput): Promise<TBlogDocument>;
};

export type TBlogMethods = {
  updateBlog(dto: TBlogUpdateInput): TBlogDocument;
};
