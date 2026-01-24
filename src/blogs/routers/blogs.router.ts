import { Router } from 'express';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';
import {
  paramsBlogIdValidationMiddleware,
  paramsIdValidationMiddleware,
} from '../../core/middlewares/validation/params-id.validation.middleware';
import { superAdminGuardMiddleware } from '../../auth/middlewares/super-admin.guard-middleware';
import { routersPaths } from '../../core/constants/paths';
import { blogInputDtoMiddleware } from '../middlewares/blog.input-dto.middleware';
import { blogInputQueryMiddleware } from '../middlewares/blog.input-query.middleware';
import { postByBlogIdInputDtoMiddleware } from '../../posts/middlewares/post.input-dto.middleware';
import { postInputQueryMiddleware } from '../../posts/middlewares/post.input-query.middleware';
import { getBlogListHandler } from './handlers/get-blog-list.handler';
import { getBlogHandler } from './handlers/get-blog.handler';
import { createBlogHandler } from './handlers/create-blog.handler';
import { deleteBlogHandler } from './handlers/delete-blog.handler';
import { updateBlogHandler } from './handlers/update-blog.handler';
import { getPostListByBlogIdHandler } from './handlers/get-post-list-by-blogId.handler';
import { createPostByBlogId } from './handlers/create-post-by-blogId.handler';

export const blogsRouter = Router({});

blogsRouter
  .get(routersPaths.empty, blogInputQueryMiddleware, getBlogListHandler)
  .get(
    routersPaths.blogs.allPostsByBlogId,
    paramsBlogIdValidationMiddleware,
    postInputQueryMiddleware,
    getPostListByBlogIdHandler,
  )
  .get(
    routersPaths.byId,
    paramsIdValidationMiddleware,
    inputValidationResultMiddleware,
    getBlogHandler,
  )
  .post(
    routersPaths.empty,
    superAdminGuardMiddleware,
    blogInputDtoMiddleware,
    inputValidationResultMiddleware,
    createBlogHandler,
  )
  .post(
    routersPaths.blogs.allPostsByBlogId,
    superAdminGuardMiddleware,
    postByBlogIdInputDtoMiddleware,
    inputValidationResultMiddleware,
    createPostByBlogId,
  )
  .put(
    routersPaths.byId,
    superAdminGuardMiddleware,
    paramsIdValidationMiddleware,
    blogInputDtoMiddleware,
    inputValidationResultMiddleware,
    updateBlogHandler,
  )
  .delete(
    routersPaths.byId,
    superAdminGuardMiddleware,
    paramsIdValidationMiddleware,
    inputValidationResultMiddleware,
    deleteBlogHandler,
  );
