import { superAdminGuardMiddleware } from './../../auth/middlewares/super-admin.guard-middleware';
import { Router } from 'express';
import { paramsIdValidationMiddleware } from '../../core/middlewares/validation/params-id.validation.middleware';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';
import { routersPaths } from '../../core/constants/paths';
import { postInputDtoMiddleware } from '../middlewares/post.input-dto.middleware';
import { postInputQueryMiddleware } from '../middlewares/post.input-query.middleware';
import { getPostListHandler } from './handlers/get-post-list.handler';
import { getPostHandler } from './handlers/get-post.handler';
import { createPostHandler } from './handlers/create-post.handler';
import { updatePostHandler } from './handlers/update-post.handler';
import { deletePostHandler } from './handlers/delete-post.handler';

export const postsRouter = Router({});

postsRouter
  .get(routersPaths.empty, postInputQueryMiddleware, getPostListHandler)
  .get(
    routersPaths.byId,
    paramsIdValidationMiddleware,
    inputValidationResultMiddleware,
    getPostHandler,
  )
  .post(
    routersPaths.empty,
    superAdminGuardMiddleware,
    postInputDtoMiddleware,
    inputValidationResultMiddleware,
    createPostHandler,
  )
  .put(
    routersPaths.byId,
    superAdminGuardMiddleware,
    paramsIdValidationMiddleware,
    postInputDtoMiddleware,
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
