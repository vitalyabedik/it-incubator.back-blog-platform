import request from 'supertest';
import { Express } from 'express';
import { TESTS_PATH_RESET_DB } from '../../src/core/constants/paths';
import { EHttpStatus } from '../../src/core/constants/http';

export const clearDb = async (app: Express) => {
  await request(app)
    .delete(TESTS_PATH_RESET_DB)
    .expect(EHttpStatus.NO_CONTENT_204);
  return;
};
