import { Model, model, Schema } from 'mongoose';
import {
  TBlog,
  TBlogDocument,
  TBlogMethods,
  TBlogStaticMethods,
} from '../types/blog.types';
import { TBlogUpdateInput } from '../routers/input/blog-update.input';
import { TBlogCreateInput } from '../routers/input/blog-create.input';
import { mapToDocumentBlog } from '../repositories/mappers/map-to-document-blog.util';

type TBlogModel = Model<TBlog, unknown, TBlogMethods> & TBlogStaticMethods;

const blogSchema = new Schema<TBlog, TBlogModel, TBlogMethods>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    websiteUrl: {
      type: String,
      required: true,
    },
    isMembership: {
      type: Boolean,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
    },
  },
  { collection: 'blogs', versionKey: false },
);

blogSchema.method('updateBlog', function updateBlog(args: TBlogUpdateInput) {
  this.name = args.name;
  this.description = args.description;
  this.websiteUrl = args.websiteUrl;

  return this;
});

blogSchema.static(
  'createBlogInstance',
  async function createBlogInstance(
    dto: TBlogCreateInput,
  ): ReturnType<TBlogStaticMethods['createBlogInstance']> {
    const newBlog = mapToDocumentBlog(dto);

    const blogDocument = await this.create(newBlog);

    return blogDocument as unknown as TBlogDocument;
  },
);

export const BlogModel = model<TBlog, TBlogModel>('blog', blogSchema);
