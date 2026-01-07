import { db } from '../../db/in-memory.db';
import { TPostView } from '../types';

export const postsRepository = {
  findAll(): TPostView[] {
    return db.posts;
  },
};
