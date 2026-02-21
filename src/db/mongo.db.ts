import { Collection, Db, MongoClient } from 'mongodb';
import { TRequestLogsDB } from '../logs/domain/request-logs-db';
import { TUserDB } from '../users/domain/userDB';
import { TBlogDB } from '../blogs/domain/blogDB';
import { TPostDB } from '../posts/domain/postDB';
import { TCommentDB } from '../comments/domain/commentDB';
import { SETTINGS } from '../core/settings';
import { TDeviceDB } from '../securityDevices/domain/deviceDB';

const CONNECTED_DB_MESSAGE = 'Connected to the database';
const ERROR_CONNECT_DB_MESSAGE = 'Database not connected';
const WITHOUT_ACTIVE_CONNECTIONS_DB_MESSAGE = 'No active client';

const DB_PING = 1;
const SESSION_TTL_NAME = 'SESSION_TTL';
const SESSION_TTL_EXPIRE = 24 * 3600;
const SESSION_TTL_EXPIRATION_DATE = 1;
const REQUESTS_LOGS_TTL_NAME = 'REQUESTS_LOGS_TTL';
const REQUESTS_LOGS_TTL_EXPIRE = 3600;
const REQUESTS_LOGS_TTL_DATE = 1;

/**
 * Имена коллекций
 */
const REQUEST_LOGS_COLLECTION_NAME = 'request_logs';
const SECURITY_DEVICES_COLLECTION_NAME = 'security-devices';
const USERS_COLLECTION_NAME = 'users';
const BLOGS_COLLECTION_NAME = 'blogs';
const POSTS_COLLECTION_NAME = 'posts';
const COMMENTS_COLLECTION_NAME = 'comments';

export let client: MongoClient;
export let requestLogsCollection: Collection<TRequestLogsDB>;
export let securityDevicesCollection: Collection<TDeviceDB>;
export let userCollection: Collection<TUserDB>;
export let blogCollection: Collection<TBlogDB>;
export let postCollection: Collection<TPostDB>;
export let commentCollection: Collection<TCommentDB>;

export const runDB = async (url: string): Promise<void> => {
  client = new MongoClient(url);
  const db: Db = client.db(SETTINGS.DB_NAME);

  requestLogsCollection = db.collection<TRequestLogsDB>(
    REQUEST_LOGS_COLLECTION_NAME,
  );
  securityDevicesCollection = db.collection<TDeviceDB>(
    SECURITY_DEVICES_COLLECTION_NAME,
  );
  userCollection = db.collection<TUserDB>(USERS_COLLECTION_NAME);
  blogCollection = db.collection<TBlogDB>(BLOGS_COLLECTION_NAME);
  postCollection = db.collection<TPostDB>(POSTS_COLLECTION_NAME);
  commentCollection = db.collection<TCommentDB>(COMMENTS_COLLECTION_NAME);

  securityDevicesCollection.createIndex(
    { expirationDate: SESSION_TTL_EXPIRATION_DATE },
    { expireAfterSeconds: SESSION_TTL_EXPIRE, name: SESSION_TTL_NAME },
  );

  requestLogsCollection.createIndex(
    { date: REQUESTS_LOGS_TTL_DATE },
    {
      expireAfterSeconds: REQUESTS_LOGS_TTL_EXPIRE,
      name: REQUESTS_LOGS_TTL_NAME,
    },
  );

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
