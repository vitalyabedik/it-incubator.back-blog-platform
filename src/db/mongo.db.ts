import mongoose from 'mongoose';

const CONNECTED_DB_MESSAGE = 'Connected to the database';
const ERROR_CONNECT_DB_MESSAGE = 'Database not connected';
const ERROR_CLOSE_CONNECT_DB_MESSAGE = 'No close DB connection';
const ERROR_WHILE_CLOSING_CONNECT_DB_MESSAGE =
  'Error while closing DB connection';

export const runDB = async (url: string) => {
  try {
    const mongooseDB = await mongoose.connect(`${url}`);

    console.log(CONNECTED_DB_MESSAGE);

    return mongooseDB;
  } catch (error) {
    throw new Error(`${ERROR_CONNECT_DB_MESSAGE}: ${error}`);
  }
};

export const stopDB = async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log(ERROR_CLOSE_CONNECT_DB_MESSAGE);
    }
  } catch (e) {
    console.error(ERROR_WHILE_CLOSING_CONNECT_DB_MESSAGE, e);
  }
};
