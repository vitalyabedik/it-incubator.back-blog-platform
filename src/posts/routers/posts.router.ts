import { Router } from 'express';
import { superAdminGuardMiddleware } from '../../auth/middlewares/super-admin.guard-middleware';
import { accessTokenMiddleware } from '../../auth/middlewares/access-token.guard-middleware';
import { commentInputQueryMiddleware } from '../../comments/middlewares/comment.input-query.middleware';
import { commentInputDtoMiddleware } from '../../comments/middlewares/comment.input-dto.middleware';
import {
  paramsIdValidationMiddleware,
  paramsPostIdValidationMiddleware,
} from '../../core/middlewares/validation/params-id.validation.middleware';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';
import { routersPaths } from '../../core/constants/paths';
import { postInputDtoMiddleware } from '../middlewares/post.input-dto.middleware';
import { postInputQueryMiddleware } from '../middlewares/post.input-query.middleware';
import { getPostListHandler } from './handlers/get-post-list.handler';
import { getPostHandler } from './handlers/get-post.handler';
import { createPostHandler } from './handlers/create-post.handler';
import { updatePostHandler } from './handlers/update-post.handler';
import { deletePostHandler } from './handlers/delete-post.handler';
import { getCommentListByPostIdHandler } from './handlers/get-comment-list-by-postId.handler';
import { createCommentByPostId } from './handlers/create-comment-by-postId.handler';

export const postsRouter = Router({});

postsRouter
  .get(routersPaths.empty, postInputQueryMiddleware, getPostListHandler)
  .get(
    routersPaths.posts.commentsByPostId,
    paramsPostIdValidationMiddleware,
    commentInputQueryMiddleware,
    getCommentListByPostIdHandler,
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
    postInputDtoMiddleware,
    inputValidationResultMiddleware,
    createPostHandler,
  )
  .post(
    routersPaths.posts.commentsByPostId,
    accessTokenMiddleware,
    commentInputDtoMiddleware,
    inputValidationResultMiddleware,
    createCommentByPostId,
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
