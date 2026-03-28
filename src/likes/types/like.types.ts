import { HydratedDocument } from 'mongoose';
import { ELikeStatus } from '../constants/like-status';
import { TLikeCreateInput } from '../repositories/input/like-create.input';

export type TLike = {
  authorId: string;
  login: string;
  parentId: string;
  createdAt: Date;
  status: ELikeStatus;
  addedLikeDate: Date | null;
};

export type TLikeDocument = HydratedDocument<TLike>;

export type TLikeStaticMethods = {
  createLikeInstance(dto: TLikeCreateInput): Promise<TLikeDocument>;
};

export type TLikeMethods = {
  updateLikeStatus(likeStatus: ELikeStatus): TLikeDocument;
};
