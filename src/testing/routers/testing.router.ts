import { Router, Request, Response } from 'express';
import { db } from '../../db/in-memory.db';
import { ERoutePath } from '../../core/constants/paths';
import { EHttpStatus } from '../../core/constants/http';

export const testingRouter = Router({});

testingRouter.delete(ERoutePath.Reset_DB, (_: Request, res: Response) => {
  db.blogs = [];
  db.posts = [];

  res.sendStatus(EHttpStatus.NO_CONTENT_204);
});
