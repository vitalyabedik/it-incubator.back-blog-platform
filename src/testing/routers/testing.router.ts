import { Router, Request, Response } from 'express';
import { blogCollection, postCollection } from '../../db/mongo.db';
import { EHttpStatus } from '../../core/constants/http';
import { routersPaths } from '../../core/constants/paths';

export const testingRouter = Router({});

testingRouter.delete(
  routersPaths.resetDb,
  async (_: Request, res: Response) => {
    await Promise.all([
      blogCollection.deleteMany(),
      postCollection.deleteMany(),
    ]);

    res.sendStatus(EHttpStatus.NO_CONTENT_204);
  },
);
