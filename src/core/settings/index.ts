import 'dotenv/config';

export const SETTINGS = {
  PORT: process.env.PORT,
  MONGO_URL: String(process.env.MONGO_URL),
  DB_NAME: String(process.env.DB_NAME),
  ADMIN_USERNAME: String(process.env.ADMIN_USERNAME),
  ADMIN_PASSWORD: String(process.env.ADMIN_PASSWORD),
  AC_SECRET: String(process.env.AC_SECRET),
  AC_TIME: String(process.env.AC_TIME),
  RT_SECRET: String(process.env.RT_SECRET),
  RT_TIME: String(process.env.RT_TIME),
  EMAIL: String(process.env.EMAIL),
  EMAIL_PASS: String(process.env.EMAIL_PASS),
};
