import {
  HydratedDocument,
  InferSchemaType,
  model,
  Schema,
  Types,
} from 'mongoose';
import { ELikeStatus } from '../constants/like-status';

const likeSchema = new Schema(
  {
    status: {
      type: String,
      enum: ELikeStatus,
      default: ELikeStatus.None,
    },
    authorId: { type: String, required: true },
    createdAt: {
      type: Date,
      required: true,
    },
    parentId: { type: String, required: true },
  },
  { collection: 'likes', versionKey: false },
);

export type TLike = InferSchemaType<typeof likeSchema> & {
  _id: Types.ObjectId;
};

export type TLikeDocument = HydratedDocument<TLike>;

export const LikeModel = model<TLike>('like', likeSchema);
