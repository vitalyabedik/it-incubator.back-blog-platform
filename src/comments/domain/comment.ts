import { TCommentatorInfo } from './commentator-info';

export type TComment = {
  content: string;
  commentatorInfo: TCommentatorInfo;
  createdAt: string;
};
