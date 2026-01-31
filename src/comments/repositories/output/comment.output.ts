import { TCommentatorInfo } from '../../domain/commentator-info';

export type TCommentOutput = {
  id: string;
  content: string;
  commentatorInfo: TCommentatorInfo;
  createdAt: string;
};
