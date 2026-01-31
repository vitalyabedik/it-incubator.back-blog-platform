import request from 'supertest';
import { Express } from 'express';
import { EHttpStatus } from '../../../src/core/constants/http';
import { stopDB } from '../../../src/db/mongo.db';
import { setupTestApp } from '../../utils/setup-test-app';
import {
  COMMENTS_PATH,
  POSTS_PATH,
  routersPaths,
} from '../../../src/core/constants/paths';
import { TCommentCreateInput } from '../../../src/comments/routers/input/comment-create.input';
import { COMMENT_CONTENT_MAX_FIELD_LENGTH } from '../../../src/comments/constants/validation';
import { createBlog } from '../../utils/blogs/create-blog';
import { createPost } from '../../utils/posts/create-post';
import { createUser } from '../../utils/users/create-user';
import { loginUser } from '../../utils/auth/login-user';
import { getCommentDto } from '../../utils/comments/get-comment-dto';
import { createComment } from '../../utils/comments/create-comment';
import { getCommentById } from '../../utils/comments/get-comment-by-id';

describe('Comment API body validation check', () => {
  let app: Express;
  let authToken: string;

  const correctTestCommentData: TCommentCreateInput = getCommentDto();
  const errorsLength = Object.keys(correctTestCommentData).length;

  beforeAll(async () => {
    ({ app, authToken } = await setupTestApp());
  });

  afterAll(async () => {
    await stopDB();
  });

  it('POST /api/posts/:postId/comments; не должен создавать comment с некорректным body', async () => {
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
        password: 'userpassword1',
        email: 'newUser1@gmail.com',
      },
    });
    const { accessToken } = await loginUser({
      app,
      authToken,
      userData: createdUser,
    });

    const invalidDataSet1: TCommentCreateInput = {
      content: '',
    };
    const invalidDataSetRequest1 = await request(app)
      .post(`${POSTS_PATH}/${createdPost.id}${routersPaths.comments}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(invalidDataSet1)
      .expect(EHttpStatus.BAD_REQUEST_400);

    expect(invalidDataSetRequest1.body.errorsMessages).toHaveLength(
      errorsLength,
    );

    const invalidDataSet2: TCommentCreateInput = {
      content: '         ',
    };
    const invalidDataSetRequest2 = await request(app)
      .post(`${POSTS_PATH}/${createdPost.id}${routersPaths.comments}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(invalidDataSet2)
      .expect(EHttpStatus.BAD_REQUEST_400);

    expect(invalidDataSetRequest2.body.errorsMessages).toHaveLength(
      errorsLength,
    );

    const invalidDataSet3: TCommentCreateInput = {
      content: '12'.repeat(COMMENT_CONTENT_MAX_FIELD_LENGTH),
    };
    const invalidDataSetRequest3 = await request(app)
      .post(`${POSTS_PATH}/${createdPost.id}${routersPaths.comments}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(invalidDataSet3)
      .expect(EHttpStatus.BAD_REQUEST_400);

    expect(invalidDataSetRequest3.body.errorsMessages).toHaveLength(
      errorsLength,
    );

    const commentListResponse = await request(app)
      .get(`${POSTS_PATH}/${createdPost.id}${routersPaths.comments}`)
      .expect(EHttpStatus.OK_200);

    expect(commentListResponse.body.items).toHaveLength(0);
  });

  it('PUT /api/comments/:commentId; не должен изменять comment с некорректным body', async () => {
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
        password: 'userpassword2',
        email: 'newUser2@gmail.com',
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

    const invalidDataSet1: TCommentCreateInput = {
      content: '',
    };
    const invalidDataSetRequest1 = await request(app)
      .put(`${COMMENTS_PATH}/${createdComment.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(invalidDataSet1)
      .expect(EHttpStatus.BAD_REQUEST_400);

    expect(invalidDataSetRequest1.body.errorsMessages).toHaveLength(
      errorsLength,
    );

    const invalidDataSet2: TCommentCreateInput = {
      content: '         ',
    };
    const invalidDataSetRequest2 = await request(app)
      .put(`${COMMENTS_PATH}/${createdComment.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(invalidDataSet2)
      .expect(EHttpStatus.BAD_REQUEST_400);

    expect(invalidDataSetRequest2.body.errorsMessages).toHaveLength(
      errorsLength,
    );

    const invalidDataSet3: TCommentCreateInput = {
      content: '12'.repeat(COMMENT_CONTENT_MAX_FIELD_LENGTH),
    };
    const invalidDataSetRequest3 = await request(app)
      .put(`${COMMENTS_PATH}/${createdComment.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(invalidDataSet3)
      .expect(EHttpStatus.BAD_REQUEST_400);

    expect(invalidDataSetRequest3.body.errorsMessages).toHaveLength(
      errorsLength,
    );

    const comment = await getCommentById({
      app,
      commentId: createdComment.id,
    });

    expect(comment).toEqual(createdComment);
  });
});
