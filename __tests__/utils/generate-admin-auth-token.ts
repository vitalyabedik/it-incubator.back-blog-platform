import {
  ADMIN_PASSWORD,
  ADMIN_USERNAME,
  AUTH_TYPE,
} from '../../src/auth/middlewares/super-admin.guard-middleware';

export const generateBasicAuthToken = () => {
  const credentials = `${ADMIN_USERNAME}:${ADMIN_PASSWORD}`;
  const token = Buffer.from(credentials).toString('base64');

  return `${AUTH_TYPE} ${token}`;
};
