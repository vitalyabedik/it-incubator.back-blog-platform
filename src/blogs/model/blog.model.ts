import {
  HydratedDocument,
  InferSchemaType,
  model,
  Schema,
  Types,
} from 'mongoose';

const blogSchema = new Schema(
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

export type TBlog = InferSchemaType<typeof blogSchema> & {
  _id: Types.ObjectId;
};
export type TBlogDocument = HydratedDocument<TBlog>;

export const BlogModel = model<TBlog>('blog', blogSchema);
