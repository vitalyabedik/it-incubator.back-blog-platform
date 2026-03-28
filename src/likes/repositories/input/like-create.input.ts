import { ELikeStatus } from '../../constants/like-status';

export type TLikeCreateInput = {
  authorId: string;
  login: string;
  parentId: string;
  likeStatus: ELikeStatus;
};
