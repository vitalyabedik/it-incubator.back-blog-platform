import { Router } from 'express';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';
import { paramsIdValidationMiddleware } from '../../core/middlewares/validation/params-id.validation.middleware';
import { accessTokenMiddleware } from '../../auth/middlewares/access-token.guard-middleware';
import { routersPaths } from '../../core/constants/paths';
import { commentInputDtoMiddleware } from '../middlewares/comment.input-dto.middleware';
import { iocContainer } from '../../composition-root';
import { CommentsController } from '../controller/comments.controller';

const commentsController = iocContainer.get(CommentsController);

export const commentsRouter = Router({});

commentsRouter
  .get(
    routersPaths.byId,
    paramsIdValidationMiddleware,
    inputValidationResultMiddleware,
    commentsController.getComment.bind(commentsController),
  )
  .put(
    routersPaths.byId,
    accessTokenMiddleware,
    paramsIdValidationMiddleware,
    commentInputDtoMiddleware,
    inputValidationResultMiddleware,
    commentsController.updateComment.bind(commentsController),
  )
  .delete(
    routersPaths.byId,
    accessTokenMiddleware,
    paramsIdValidationMiddleware,
    inputValidationResultMiddleware,
    commentsController.deleteComment.bind(commentsController),
  );
