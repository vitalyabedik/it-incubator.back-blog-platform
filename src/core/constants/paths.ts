export const AUTH_PATH = '/api/auth';
export const USERS_PATH = '/api/users';
export const BLOGS_PATH = '/api/blogs';
export const POSTS_PATH = '/api/posts';
export const COMMENTS_PATH = '/api/comments';
export const TESTING_PATH = '/api/testing';
export const TESTS_PATH_RESET_DB = '/api/testing/all-data';

export const routersPaths = {
  empty: '',
  root: '/',
  byId: '/:id',
  auth: {
    me: '/me',
    login: '/login',
    logout: '/logout',
    registration: '/registration',
    registrationConfirmation: '/registration-confirmation',
    registrationEmailResending: '/registration-email-resending',
    refreshToken: '/refresh-token',
  },
  blogs: {
    postsByBlogId: '/:id/posts',
  },
  posts: {
    commentsByPostId: '/:id/comments',
  },
  comments: '/comments',
  testing: '/testing',
  resetDb: '/all-data',
};
