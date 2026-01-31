import { TCommentatorInfo } from './commentator-info';

export type TCommentDB = {
  postId: string;
  content: string;
  commentatorInfo: TCommentatorInfo;
  createdAt: string;
};
