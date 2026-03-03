import { Router } from 'express';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';
import { paramsIdValidationMiddleware } from '../../core/middlewares/validation/params-id.validation.middleware';
import { superAdminGuardMiddleware } from '../../auth/middlewares/super-admin.guard-middleware';
import { routersPaths } from '../../core/constants/paths';
import { blogInputDtoMiddleware } from '../middlewares/blog.input-dto.middleware';
import { blogInputQueryMiddleware } from '../middlewares/blog.input-query.middleware';
import { postByBlogIdInputDtoMiddleware } from '../../posts/middlewares/post.input-dto.middleware';
import { postInputQueryMiddleware } from '../../posts/middlewares/post.input-query.middleware';
import { iocContainer } from '../../composition-root';
import { BlogsController } from '../controller/blogs.controller';

const blogsController = iocContainer.get(BlogsController);

export const blogsRouter = Router({});

blogsRouter
  .get(
    routersPaths.empty,
    blogInputQueryMiddleware,
    blogsController.getBlogList.bind(blogsController),
  )
  .get(
    routersPaths.blogs.postsByBlogId,
    paramsIdValidationMiddleware,
    postInputQueryMiddleware,
    blogsController.getPostListByBlogId.bind(blogsController),
  )
  .get(
    routersPaths.byId,
    paramsIdValidationMiddleware,
    inputValidationResultMiddleware,
    blogsController.getBlog.bind(blogsController),
  )
  .post(
    routersPaths.empty,
    superAdminGuardMiddleware,
    blogInputDtoMiddleware,
    inputValidationResultMiddleware,
    blogsController.createBlog.bind(blogsController),
  )
  .post(
    routersPaths.blogs.postsByBlogId,
    superAdminGuardMiddleware,
    postByBlogIdInputDtoMiddleware,
    inputValidationResultMiddleware,
    blogsController.createPostByBlogId.bind(blogsController),
  )
  .put(
    routersPaths.byId,
    superAdminGuardMiddleware,
    paramsIdValidationMiddleware,
    blogInputDtoMiddleware,
    inputValidationResultMiddleware,
    blogsController.updateBlog.bind(blogsController),
  )
  .delete(
    routersPaths.byId,
    superAdminGuardMiddleware,
    paramsIdValidationMiddleware,
    inputValidationResultMiddleware,
    blogsController.deleteBlog.bind(blogsController),
  );
