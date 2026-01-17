export const BLOGS_PATH = '/api/blogs';
export const POSTS_PATH = '/api/posts';
export const TESTING_PATH = '/api/testing';
export const TESTS_PATH_RESET_DB = '/api/testing/all-data';

export const routersPaths = {
  empty: '',
  root: '/',
  byId: '/:id',
  blogs: {
    allPostsByBlogId: '/:blogId/posts',
  },
  testing: '/testing',
  resetDb: '/all-data',
};
