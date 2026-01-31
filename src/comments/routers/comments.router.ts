import { Router } from 'express';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';
import {
  paramsCommentIdValidationMiddleware,
  paramsIdValidationMiddleware,
} from '../../core/middlewares/validation/params-id.validation.middleware';
import { accessTokenMiddleware } from '../../auth/middlewares/access-token.guard-middleware';
import { routersPaths } from '../../core/constants/paths';
import { commentInputDtoMiddleware } from '../middlewares/comment.input-dto.middleware';
import { getCommentHandler } from './handlers/get-comment.handler';
import { deleteCommentHandler } from './handlers/delete-comment.handler';
import { updateCommentHandler } from './handlers/update-comment.handler';

export const commentsRouter = Router({});

commentsRouter
  .get(
    routersPaths.byId,
    paramsIdValidationMiddleware,
    inputValidationResultMiddleware,
    getCommentHandler,
  )
  .put(
    routersPaths.byCommentId,
    accessTokenMiddleware,
    paramsCommentIdValidationMiddleware,
    commentInputDtoMiddleware,
    inputValidationResultMiddleware,
    updateCommentHandler,
  )
  .delete(
    routersPaths.byCommentId,
    accessTokenMiddleware,
    paramsCommentIdValidationMiddleware,
    inputValidationResultMiddleware,
    deleteCommentHandler,
  );
