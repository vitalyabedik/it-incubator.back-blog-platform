import { Collection, Db, MongoClient } from 'mongodb';
import { TBlog } from '../blogs/domain/blog';
import { TPost } from '../posts/domain/post';
import { SETTINGS } from '../core/settings';

const CONNECTED_DB_MESSAGE = 'Connected to the database';
const ERROR_CONNECT_DB_MESSAGE = 'Database not connected';
const WITHOUT_ACTIVE_CONNECTIONS_DB_MESSAGE = 'No active client';

const DB_PING = 1;

const BLOGS_COLLECTION_NAME = 'blogs';
const POSTS_COLLECTION_NAME = 'posts';

export let client: MongoClient;
export let blogCollection: Collection<TBlog>;
export let postCollection: Collection<TPost>;

export const runDB = async (url: string): Promise<void> => {
  client = new MongoClient(url);
  const db: Db = client.db(SETTINGS.DB_NAME);

  blogCollection = db.collection<TBlog>(BLOGS_COLLECTION_NAME);
  postCollection = db.collection<TPost>(POSTS_COLLECTION_NAME);

  try {
    await client.connect();
    await db.command({ ping: DB_PING });

    console.log(CONNECTED_DB_MESSAGE);
  } catch (error) {
    await client.close();
    throw new Error(`${ERROR_CONNECT_DB_MESSAGE}: ${error}`);
  }
};

export const stopDB = async () => {
  if (!client) {
    throw new Error(WITHOUT_ACTIVE_CONNECTIONS_DB_MESSAGE);
  }

  await client.close();
};
