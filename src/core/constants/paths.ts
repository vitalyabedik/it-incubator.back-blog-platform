export const AUTH_PATH = '/api/auth';
export const BLOGS_PATH = '/api/blogs';
export const POSTS_PATH = '/api/posts';
export const USERS_PATH = '/api/users';
export const TESTING_PATH = '/api/testing';
export const TESTS_PATH_RESET_DB = '/api/testing/all-data';

export const routersPaths = {
  empty: '',
  root: '/',
  byId: '/:id',
  auth: {
    login: '/login',
  },
  blogs: {
    allPostsByBlogId: '/:blogId/posts',
  },
  testing: '/testing',
  resetDb: '/all-data',
};
