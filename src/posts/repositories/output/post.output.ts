import { TPost } from '../../domain/post';

export type TPostOutput = TPost & {
  id: string;
};
