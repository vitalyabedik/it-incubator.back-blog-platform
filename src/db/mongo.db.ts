import { Collection, Db, MongoClient } from 'mongodb';
import { TRevokedRefreshTokenDB } from '../auth/domain/revokedRefreshTokenDB';
import { TUserDB } from '../users/domain/userDB';
import { TBlogDB } from '../blogs/domain/blogDB';
import { TPostDB } from '../posts/domain/postDB';
import { TCommentDB } from '../comments/domain/commentDB';
import { SETTINGS } from '../core/settings';

const CONNECTED_DB_MESSAGE = 'Connected to the database';
const ERROR_CONNECT_DB_MESSAGE = 'Database not connected';
const WITHOUT_ACTIVE_CONNECTIONS_DB_MESSAGE = 'No active client';

const DB_PING = 1;

const REVOKED_REFRESH_TOKENS_COLLECTION_NAME = 'revoked-refresh-tokens';
const USERS_COLLECTION_NAME = 'users';
const BLOGS_COLLECTION_NAME = 'blogs';
const POSTS_COLLECTION_NAME = 'posts';
const COMMENTS_COLLECTION_NAME = 'comments';

export let client: MongoClient;
export let revokedRefreshTokenCollection: Collection<TRevokedRefreshTokenDB>;
export let userCollection: Collection<TUserDB>;
export let blogCollection: Collection<TBlogDB>;
export let postCollection: Collection<TPostDB>;
export let commentCollection: Collection<TCommentDB>;

export const runDB = async (url: string): Promise<void> => {
  client = new MongoClient(url);
  const db: Db = client.db(SETTINGS.DB_NAME);

  revokedRefreshTokenCollection = db.collection<TRevokedRefreshTokenDB>(
    REVOKED_REFRESH_TOKENS_COLLECTION_NAME,
  );
  userCollection = db.collection<TUserDB>(USERS_COLLECTION_NAME);
  blogCollection = db.collection<TBlogDB>(BLOGS_COLLECTION_NAME);
  postCollection = db.collection<TPostDB>(POSTS_COLLECTION_NAME);
  commentCollection = db.collection<TCommentDB>(COMMENTS_COLLECTION_NAME);

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
