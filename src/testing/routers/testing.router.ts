import { Router, Request, Response } from 'express';
import { EHttpStatus } from '../../core/constants/http';
import { routersPaths } from '../../core/constants/paths';
import { UserDeviceSessionModel } from '../../securityDevices/model/user-device-session.model';
import { UserModel } from '../../users/model/user.model';
import { BlogModel } from '../../blogs/model/blog.model';
import { CommentModel } from '../../comments/model/comment.model';
import { LikeModel } from '../../likes/model/like.model';
import { RequestLogModel } from '../../logs/model/request-log.model';
import { PostModel } from '../../posts/model/post.model';

export const testingRouter = Router({});

testingRouter.delete(
  routersPaths.resetDb,
  async (_: Request, res: Response) => {
    try {
      await Promise.all([
        BlogModel.deleteMany(),
        PostModel.deleteMany(),
        CommentModel.deleteMany(),
        UserModel.deleteMany(),
        UserDeviceSessionModel.deleteMany(),
        RequestLogModel.deleteMany(),
        LikeModel.deleteMany(),
      ]);

      res.sendStatus(EHttpStatus.NO_CONTENT_204);
    } catch {
      res.sendStatus(EHttpStatus.INTERNAL_SERVER_ERROR_500);
    }
  },
);
