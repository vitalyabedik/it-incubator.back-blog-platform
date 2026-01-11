import express, { Express } from 'express';
import {
  BLOGS_PATH,
  POSTS_PATH,
  ERoutePath,
  TESTING_PATH,
} from './core/constants/paths';
import { EHttpStatus } from './core/constants/http';
import { blogsRouter } from './blogs/routers/blogs.router';
import { postsRouter } from './posts/routers/posts.router';
import { testingRouter } from './testing/routers/testing.router';

const MAIN_MESSAGE = 'Hello Blog Platform!';

export const setupApp = (app: Express) => {
  app.use(express.json());

  app.get(ERoutePath.Main, (_, res) => {
    res.status(EHttpStatus.OK_200).send(MAIN_MESSAGE);
  });

  app.use(BLOGS_PATH, blogsRouter);
  app.use(POSTS_PATH, postsRouter);
  app.use(TESTING_PATH, testingRouter);

  return app;
};
