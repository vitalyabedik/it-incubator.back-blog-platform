import { superAdminGuardMiddleware } from './../../auth/middlewares/super-admin.guard-middleware';
import { Router } from 'express';
import { getPostListHandler } from './handlers/get-post-list.handler';
import { paramsIdValidationMiddleware } from '../../core/middlewares/validation/params-id.validation.middleware';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';
import { getPostHandler } from './handlers/get-post.handler';
import { createPostHandler } from './handlers/create-post.handler';
import { updatePostHandler } from './handlers/update-post.handler';
import { deletePostHandler } from './handlers/delete-post.handler';
import { postInputDtoValidation } from '../validation/post.input-dto.validation-middlewares';

export const postsRouter = Router({});

postsRouter
  .get('', getPostListHandler)
  .get(
    '/:id',
    paramsIdValidationMiddleware,
    inputValidationResultMiddleware,
    getPostHandler,
  )
  .post(
    '',
    superAdminGuardMiddleware,
    postInputDtoValidation,
    inputValidationResultMiddleware,
    createPostHandler,
  )
  .put(
    '/:id',
    superAdminGuardMiddleware,
    paramsIdValidationMiddleware,
    postInputDtoValidation,
    inputValidationResultMiddleware,
    updatePostHandler,
  )
  .delete(
    '/:id',
    superAdminGuardMiddleware,
    paramsIdValidationMiddleware,
    inputValidationResultMiddleware,
    deletePostHandler,
  );
