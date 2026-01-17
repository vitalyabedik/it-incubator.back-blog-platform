import express, { Express } from 'express';
import { setupApp } from '../../src/setup-app';
import { SETTINGS } from '../../src/core/settings';
import { runDB } from '../../src/db/mongo.db';
import { generateBasicAuthToken } from './generate-admin-auth-token';
import { clearDb } from './clear-db';

type TReturn = {
  app: Express;
  authToken: string;
};

export const setupTestApp = async (): Promise<TReturn> => {
  const app = express();
  const authToken = generateBasicAuthToken();

  setupApp(app);
  await runDB(SETTINGS.MONGO_URL!);
  await clearDb(app);

  return { app, authToken };
};
