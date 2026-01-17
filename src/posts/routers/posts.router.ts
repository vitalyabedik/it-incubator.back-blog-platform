import { superAdminGuardMiddleware } from './../../auth/middlewares/super-admin.guard-middleware';
import { Router } from 'express';
import { getPostListHandler } from './handlers/get-post-list.handler';
import { paramsIdValidationMiddleware } from '../../core/middlewares/validation/params-id.validation.middleware';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';
import { routersPaths } from '../../core/constants/paths';
import { getPostHandler } from './handlers/get-post.handler';
import { createPostHandler } from './handlers/create-post.handler';
import { updatePostHandler } from './handlers/update-post.handler';
import { deletePostHandler } from './handlers/delete-post.handler';
import { postInputDtoValidation } from './validation/post.input-dto.validation-middlewares';
import { paginationAndSortingValidation } from '../../core/middlewares/validation/query-pagination-sorting.validation-middleware';
import { EPostSortField } from './input/post-sort-field.input';

export const postsRouter = Router({});

postsRouter
  .get(
    routersPaths.empty,
    paginationAndSortingValidation(EPostSortField),
    getPostListHandler,
  )
  .get(
    routersPaths.byId,
    paramsIdValidationMiddleware,
    inputValidationResultMiddleware,
    getPostHandler,
  )
  .post(
    routersPaths.empty,
    superAdminGuardMiddleware,
    postInputDtoValidation,
    inputValidationResultMiddleware,
    createPostHandler,
  )
  .put(
    routersPaths.byId,
    superAdminGuardMiddleware,
    paramsIdValidationMiddleware,
    postInputDtoValidation,
    inputValidationResultMiddleware,
    updatePostHandler,
  )
  .delete(
    routersPaths.byId,
    superAdminGuardMiddleware,
    paramsIdValidationMiddleware,
    inputValidationResultMiddleware,
    deletePostHandler,
  );
