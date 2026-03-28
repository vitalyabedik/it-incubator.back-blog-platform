import { Model, model, Schema } from 'mongoose';
import { ELikeStatus } from '../constants/like-status';
import {
  TLike,
  TLikeDocument,
  TLikeMethods,
  TLikeStaticMethods,
} from '../types/like.types';
import { TLikeCreateInput } from '../repositories/input/like-create.input';
import { mapToDocumentLike } from '../mappers/map-to-document-like.util';

type TLikeModel = Model<TLike, unknown, TLikeMethods> & TLikeStaticMethods;

const likeSchema = new Schema<TLike, TLikeModel, TLikeMethods>(
  {
    authorId: { type: String, required: true },
    login: { type: String, required: true },
    parentId: { type: String, required: true },
    createdAt: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ELikeStatus,
      default: ELikeStatus.None,
    },
    addedLikeDate: {
      type: Date,
      default: null,
    },
  },
  { collection: 'likes', versionKey: false },
);

likeSchema.index({ parentId: 1, status: 1, addedLikeDate: -1 });

likeSchema.method(
  'updateLikeStatus',
  function updateLikeStatus(likeStatus: ELikeStatus) {
    this.status = likeStatus;

    return this;
  },
);

likeSchema.static(
  'createLikeInstance',
  async function createLikeInstance(
    dto: TLikeCreateInput,
  ): ReturnType<TLikeStaticMethods['createLikeInstance']> {
    const newLike = mapToDocumentLike(dto);

    const likeDocument = await this.create(newLike);

    return likeDocument as unknown as TLikeDocument;
  },
);

export const LikeModel = model<TLike, TLikeModel>('like', likeSchema);
