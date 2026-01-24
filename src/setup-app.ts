import express, { Express } from 'express';
import {
  AUTH_PATH,
  BLOGS_PATH,
  POSTS_PATH,
  routersPaths,
  TESTING_PATH,
  USERS_PATH,
} from './core/constants/paths';
import { EHttpStatus } from './core/constants/http';
import { authRouter } from './auth/routers/auth.router';
import { blogsRouter } from './blogs/routers/blogs.router';
import { postsRouter } from './posts/routers/posts.router';
import { usersRouter } from './users/routes/users.router';
import { testingRouter } from './testing/routers/testing.router';

const MAIN_MESSAGE = 'Hello Blog Platform!';

export const setupApp = (app: Express) => {
  app.use(express.json());

  app.get(routersPaths.root, (_, res) => {
    res.status(EHttpStatus.OK_200).send(MAIN_MESSAGE);
  });

  app.use(AUTH_PATH, authRouter);
  app.use(USERS_PATH, usersRouter);
  app.use(BLOGS_PATH, blogsRouter);
  app.use(POSTS_PATH, postsRouter);
  app.use(TESTING_PATH, testingRouter);

  return app;
};
