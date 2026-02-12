import { Router, Request, Response } from 'express';
import {
  revokedRefreshTokenCollection,
  userCollection,
  blogCollection,
  postCollection,
  commentCollection,
} from '../../db/mongo.db';
import { EHttpStatus } from '../../core/constants/http';
import { routersPaths } from '../../core/constants/paths';

export const testingRouter = Router({});

testingRouter.delete(
  routersPaths.resetDb,
  async (_: Request, res: Response) => {
    await Promise.all([
      revokedRefreshTokenCollection.deleteMany(),
      userCollection.deleteMany(),
      blogCollection.deleteMany(),
      postCollection.deleteMany(),
      commentCollection.deleteMany(),
    ]);

    res.sendStatus(EHttpStatus.NO_CONTENT_204);
  },
);
