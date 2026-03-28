import { TId } from './id';

declare global {
  declare namespace Express {
    export interface Request {
      user: TId | undefined;
      login: string | undefined;
    }
  }
}
