import express from 'express';
import { setupApp } from './setup-app';
import { SETTINGS } from './core/settings';
import { runDB } from './db/mongo.db';

const NO_DB_URL_MESSAGE = 'URL для подключения к БД не найден';

const bootstrap = async () => {
  const app = express();
  setupApp(app);

  const PORT = SETTINGS.PORT;

  if (!SETTINGS.MONGO_URL) {
    throw new Error(NO_DB_URL_MESSAGE);
  }

  await runDB(SETTINGS.MONGO_URL);

  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
  });

  return app;
};

bootstrap();
