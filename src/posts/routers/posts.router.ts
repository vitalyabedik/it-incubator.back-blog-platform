import { Router } from 'express';
import { superAdminGuardMiddleware } from '../../auth/middlewares/super-admin.guard-middleware';
import { accessTokenMiddleware } from '../../auth/middlewares/access-token.guard-middleware';
import { commentInputQueryMiddleware } from '../../comments/middlewares/comment.input-query.middleware';
import { commentInputDtoMiddleware } from '../../comments/middlewares/comment.input-dto.middleware';
import { paramsIdValidationMiddleware } from '../../core/middlewares/validation/params-id.validation.middleware';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';
import { routersPaths } from '../../core/constants/paths';
import { postInputDtoMiddleware } from '../middlewares/post.input-dto.middleware';
import { postInputQueryMiddleware } from '../middlewares/post.input-query.middleware';
import { PostsController } from '../controller/posts.controller';
import { iocContainer } from '../../composition-root';

const postsController = iocContainer.get(PostsController);

export const postsRouter = Router({});

postsRouter
  .get(
    routersPaths.empty,
    postInputQueryMiddleware,
    postsController.getPostList.bind(postsController),
  )
  .get(
    routersPaths.posts.commentsByPostId,
    paramsIdValidationMiddleware,
    commentInputQueryMiddleware,
    postsController.getCommentListByPostId.bind(postsController),
  )
  .get(
    routersPaths.byId,
    paramsIdValidationMiddleware,
    inputValidationResultMiddleware,
    postsController.getPost.bind(postsController),
  )
  .post(
    routersPaths.empty,
    superAdminGuardMiddleware,
    postInputDtoMiddleware,
    inputValidationResultMiddleware,
    postsController.createPost.bind(postsController),
  )
  .post(
    routersPaths.posts.commentsByPostId,
    accessTokenMiddleware,
    commentInputDtoMiddleware,
    inputValidationResultMiddleware,
    postsController.createCommentByPostId.bind(postsController),
  )
  .put(
    routersPaths.byId,
    superAdminGuardMiddleware,
    paramsIdValidationMiddleware,
    postInputDtoMiddleware,
    inputValidationResultMiddleware,
    postsController.updatePost.bind(postsController),
  )
  .delete(
    routersPaths.byId,
    superAdminGuardMiddleware,
    paramsIdValidationMiddleware,
    inputValidationResultMiddleware,
    postsController.deletePost.bind(postsController),
  );
