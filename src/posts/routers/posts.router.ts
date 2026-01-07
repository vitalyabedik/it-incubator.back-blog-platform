import { Router } from 'express';
import { getPostListHandler } from './handlers/get-post-list.handler';

export const postsRouter = Router({});

postsRouter.get('', getPostListHandler);
