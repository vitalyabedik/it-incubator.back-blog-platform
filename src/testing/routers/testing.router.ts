import { Router, Request, Response } from 'express';
import { blogCollection, postCollection } from '../../db/mongo.db';
import { ERoutePath } from '../../core/constants/paths';
import { EHttpStatus } from '../../core/constants/http';

export const testingRouter = Router({});

testingRouter.delete(ERoutePath.Reset_DB, async (_: Request, res: Response) => {
  await Promise.all([blogCollection.deleteMany(), postCollection.deleteMany()]);

  res.sendStatus(EHttpStatus.NO_CONTENT_204);
});
