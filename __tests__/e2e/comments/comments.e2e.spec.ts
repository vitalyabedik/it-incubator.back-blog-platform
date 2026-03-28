import request from 'supertest';
import { Express } from 'express';
import {
  COMMENTS_PATH,
  POSTS_PATH,
  routersPaths,
} from '../../../src/core/constants/paths';
import { EHttpStatus } from '../../../src/core/constants/http';
import { stopDB } from '../../../src/db/mongo.db';
import { setupTestApp } from '../../utils/setup-test-app';
import { createBlog } from '../../utils/blogs/create-blog';
import { createPost } from '../../utils/posts/create-post';
import { loginUser } from '../../utils/auth/login-user';
import { createComment } from '../../utils/comments/create-comment';
import { createUser } from '../../utils/users/create-user';
import { TCommentUpdateInput } from '../../../src/comments/routers/input/comment-update.input';
import { getCommentById } from '../../utils/comments/get-comment-by-id';
import { getUserDto } from '../../utils/users/get-user-dto';
import { TCommentOutput } from '../../../src/comments/repositories/output/comment.output';

describe('Comment API', () => {
  let app: Express;
  let authToken: string;

  beforeAll(async () => {
    ({ app, authToken } = await setupTestApp());
  });

  afterAll(async () => {
    await stopDB();
  });

  it('POST /api/posts/:postId/comments; должен создавать comment для поста', async () => {
    const createdBlog = await createBlog({ app, authToken });
    const createdPost = await createPost({
      app,
      authToken,
      blogOutput: createdBlog,
    });
    const createdUser = await createUser({
      app,
      authToken,
      userDto: {
        login: 'newuser1',
        password: getUserDto().password,
        email: 'newUser1@gmail.com',
      },
    });
    const { accessToken } = await loginUser({
      app,
      authToken,
      userData: createdUser,
    });

    await createComment({
      app,
      accessToken,
      postId: createdPost.id,
    });
  });

  it('GET /api/posts/:postId/comments; должен возвращать comment list для поста', async () => {
    const createdBlog = await createBlog({ app, authToken });
    const createdPost = await createPost({
      app,
      authToken,
      blogOutput: createdBlog,
    });
    const createdUser = await createUser({
      app,
      authToken,
      userDto: {
        login: 'newuser2',
        password: getUserDto().password,
        email: 'newUser2@gmail.com',
      },
    });
    const { accessToken } = await loginUser({
      app,
      authToken,
      userData: createdUser,
    });

    await createComment({
      app,
      accessToken,
      postId: createdPost.id,
      commentDto: {
        content: 'комментарий1'.repeat(3),
      },
    });
    await createComment({
      app,
      accessToken,
      postId: createdPost.id,
      commentDto: {
        content: 'комментарий2'.repeat(3),
      },
    });

    const response = await request(app)
      .get(`${POSTS_PATH}/${createdPost.id}${routersPaths.comments}`)
      .expect(EHttpStatus.OK_200);

    expect(response.body.items).toBeInstanceOf(Array);
    expect(response.body.items.length).toBeGreaterThanOrEqual(2);
  });

  it.skip('PUT /api/comments/:commentId; должен корректно изменять comment по id', async () => {
    const createdBlog = await createBlog({ app, authToken });
    const createdPost = await createPost({
      app,
      authToken,
      blogOutput: createdBlog,
    });
    const createdUser = await createUser({
      app,
      authToken,
      userDto: {
        login: 'newuser4',
        password: getUserDto().password,
        email: 'newUser4@gmail.com',
      },
    });
    const { accessToken } = await loginUser({
      app,
      authToken,
      userData: createdUser,
    });

    const createdComment = await createComment({
      app,
      accessToken,
      postId: createdPost.id,
      commentDto: {
        content: 'комментарий1'.repeat(3),
      },
    });

    const updatedCommentData: TCommentUpdateInput = {
      userId: createdUser.id,
      commentId: createdComment.id,
      content: 'обновленный 1'.repeat(3),
    };

    await request(app)
      .put(`${COMMENTS_PATH}/${createdComment.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(updatedCommentData)
      .expect(EHttpStatus.NO_CONTENT_204);

    const comment = await getCommentById({ app, commentId: createdComment.id });

    expect(comment).toEqual({
      ...createdComment,
      content: updatedCommentData.content,
    } as TCommentOutput);
  });

  it('DELETE /api/comments/:commentId; должен удалять comment по id', async () => {
    const createdBlog = await createBlog({ app, authToken });
    const createdPost = await createPost({
      app,
      authToken,
      blogOutput: createdBlog,
    });
    const createdUser = await createUser({
      app,
      authToken,
      userDto: {
        login: 'newuser3',
        password: getUserDto().password,
        email: 'newUser3@gmail.com',
      },
    });
    const { accessToken } = await loginUser({
      app,
      authToken,
      userData: createdUser,
    });

    const createdComment = await createComment({
      app,
      accessToken,
      postId: createdPost.id,
      commentDto: {
        content: 'комментарий3'.repeat(3),
      },
    });

    await request(app)
      .delete(`${COMMENTS_PATH}/${createdComment.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(EHttpStatus.NO_CONTENT_204);

    await request(app)
      .get(`${COMMENTS_PATH}/${createdComment.id}`)
      .expect(EHttpStatus.NOT_FOUND_404);
  });
});
