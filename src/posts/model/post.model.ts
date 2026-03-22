import {
  HydratedDocument,
  InferSchemaType,
  model,
  Schema,
  Types,
} from 'mongoose';

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    blogId: {
      type: String,
      required: true,
    },
    blogName: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
    },
  },
  { collection: 'posts', versionKey: false },
);

export type TPost = InferSchemaType<typeof postSchema> & {
  _id: Types.ObjectId;
};
export type TPostDocument = HydratedDocument<TPost>;

export const PostModel = model<TPost>('post', postSchema);
