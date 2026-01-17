import { Router } from 'express';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';
import {
  paramsBlogIdValidationMiddleware,
  paramsIdValidationMiddleware,
} from '../../core/middlewares/validation/params-id.validation.middleware';
import { superAdminGuardMiddleware } from '../../auth/middlewares/super-admin.guard-middleware';
import { routersPaths } from '../../core/constants/paths';
import { paginationAndSortingValidation } from '../../core/middlewares/validation/query-pagination-sorting.validation-middleware';
import { EPostSortField } from '../../posts/routers/input/post-sort-field.input';
import { postByBlogIdInputDtoValidation } from '../../posts/routers/validation/post.input-dto.validation-middlewares';
import { getBlogListHandler } from './handlers/get-blog-list.handler';
import { getBlogHandler } from './handlers/get-blog.handler';
import { createBlogHandler } from './handlers/create-blog.handler';
import { deleteBlogHandler } from './handlers/delete-blog.handler';
import { updateBlogHandler } from './handlers/update-blog.handler';
import { getPostListByBlogIdHandler } from './handlers/get-post-list-by-blogId.handler';
import { blogInputDtoValidation } from './validation/blog.input-dto.validation-middlewares';
import { EBlogSortField } from './input/blog-sort-field';
import { createPostByBlogId } from './handlers/create-post-by-blogId.handler';

export const blogsRouter = Router({});

blogsRouter
  .get(
    routersPaths.empty,
    paginationAndSortingValidation(EBlogSortField),
    getBlogListHandler,
  )
  .get(
    routersPaths.blogs.allPostsByBlogId,
    paramsBlogIdValidationMiddleware,
    paginationAndSortingValidation(EPostSortField),
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
    blogInputDtoValidation,
    inputValidationResultMiddleware,
    createBlogHandler,
  )
  .post(
    routersPaths.blogs.allPostsByBlogId,
    superAdminGuardMiddleware,
    postByBlogIdInputDtoValidation,
    inputValidationResultMiddleware,
    createPostByBlogId,
  )
  .put(
    routersPaths.byId,
    superAdminGuardMiddleware,
    paramsIdValidationMiddleware,
    blogInputDtoValidation,
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
