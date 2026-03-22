import { Container } from 'inversify';
import { NodemailerService } from './auth/adapters/nodemailer.service';
import { JWTService } from './auth/adapters/jwt.service';
import { BcryptService } from './auth/adapters/bcrypt.service';
import { AuthService } from './auth/application/auth.service';
import { AuthController } from './auth/controller/auth.controller';
import { UserDeviceSessionRepository } from './securityDevices/repositories/user-device-session.repositories';
import { UserDeviceSessionQueryRepository } from './securityDevices/repositories/user-device-session-query.repositories';
import { UserDeviceSessionService } from './securityDevices/application/user-device-session.service';
import { UserDeviceSessionController } from './securityDevices/controller/user-device-session.controller';
import { UsersQueryRepository } from './users/repositories/users-query.repositories';
import { UsersRepository } from './users/repositories/users.repositories';
import { UsersService } from './users/application/users.service';
import { UsersController } from './users/controller/users.controller';
import { BlogsQueryRepository } from './blogs/repositories/blogs-query.repositories';
import { BlogsRepository } from './blogs/repositories/blogs.repositories';
import { BlogsService } from './blogs/application/blogs.service';
import { BlogsController } from './blogs/controller/blogs.controller';
import { PostsQueryRepository } from './posts/repositories/posts-query.repositories';
import { PostsRepository } from './posts/repositories/posts.repositories';
import { PostsService } from './posts/application/posts.service';
import { PostsController } from './posts/controller/posts.controller';
import { CommentsQueryRepository } from './comments/repositories/comments-query.repositories';
import { CommentsRepository } from './comments/repositories/comments.repositories';
import { CommentsService } from './comments/application/comments.service';
import { CommentsController } from './comments/controller/comments.controller';
import { LikesRepository } from './likes/repositories/likes.repositories';

export const iocContainer = new Container();

/**
 * adapters
 */
iocContainer.bind(NodemailerService).toSelf().inSingletonScope();
iocContainer.bind(JWTService).toSelf().inSingletonScope();
iocContainer.bind(BcryptService).toSelf().inSingletonScope();
/**
 * auth
 */
iocContainer.bind(AuthService).toSelf().inSingletonScope();
iocContainer.bind(AuthController).toSelf().inSingletonScope();
/**
 * sessions
 */
iocContainer.bind(UserDeviceSessionQueryRepository).toSelf().inSingletonScope();
iocContainer.bind(UserDeviceSessionRepository).toSelf().inSingletonScope();
iocContainer.bind(UserDeviceSessionService).toSelf().inSingletonScope();
iocContainer.bind(UserDeviceSessionController).toSelf().inSingletonScope();
/**
 * users
 */
iocContainer.bind(UsersQueryRepository).toSelf().inSingletonScope();
iocContainer.bind(UsersRepository).toSelf().inSingletonScope();
iocContainer.bind(UsersService).toSelf().inSingletonScope();
iocContainer.bind(UsersController).toSelf().inSingletonScope();
/**
 * blogs
 */
iocContainer.bind(BlogsQueryRepository).toSelf().inSingletonScope();
iocContainer.bind(BlogsRepository).toSelf().inSingletonScope();
iocContainer.bind(BlogsService).toSelf().inSingletonScope();
iocContainer.bind(BlogsController).toSelf().inSingletonScope();
/**
 * posts
 */
iocContainer.bind(PostsQueryRepository).toSelf().inSingletonScope();
iocContainer.bind(PostsRepository).toSelf().inSingletonScope();
iocContainer.bind(PostsService).toSelf().inSingletonScope();
iocContainer.bind(PostsController).toSelf().inSingletonScope();
/**
 * comments
 */
iocContainer.bind(CommentsQueryRepository).toSelf().inSingletonScope();
iocContainer.bind(CommentsRepository).toSelf().inSingletonScope();
iocContainer.bind(CommentsService).toSelf().inSingletonScope();
iocContainer.bind(CommentsController).toSelf().inSingletonScope();
/**
 * likes
 */
iocContainer.bind(LikesRepository).toSelf().inSingletonScope();
