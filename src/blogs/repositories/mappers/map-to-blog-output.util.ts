import { Types } from 'mongoose';
import { TBlogOutput } from '../output/blog.output';
import { TBlog } from '../../types/blog.types';

type TArgs = { _id: Types.ObjectId } & TBlog;

export const mapToBlogOutput = (blogDocument: TArgs): TBlogOutput => ({
  id: blogDocument._id.toString(),
  name: blogDocument.name,
  description: blogDocument.description,
  websiteUrl: blogDocument.websiteUrl,
  createdAt: blogDocument.createdAt.toISOString(),
  isMembership: blogDocument.isMembership,
});
