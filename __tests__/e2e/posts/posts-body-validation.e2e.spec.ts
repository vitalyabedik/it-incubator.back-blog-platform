import request from 'supertest';
import { Express } from 'express';
import { POSTS_PATH } from '../../../src/core/constants/paths';
import { EHttpStatus } from '../../../src/core/constants/http';
import { TPostCreateInput } from '../../../src/posts/routers/input/post-create.input';
import { TPostUpdateInput } from '../../../src/posts/routers/input/post-update.input';
import { TPostOutput } from '../../../src/posts/routers/output/post.output';
import {
  POST_CONTENT_MAX_FIELD_LENGTH,
  POST_SHORT_DESCRIPTION_MAX_FIELD_LENGTH,
  POST_TITLE_MAX_FIELD_LENGTH,
} from '../../../src/posts/constants/validation';
import { stopDB } from '../../../src/db/mongo.db';
import { getPostDto } from '../../utils/posts/get-post-dto';
import { createPost } from '../../utils/posts/create-post';
import { getPostById } from '../../utils/posts/get-post-by-id';
import { createBlog } from '../../utils/blogs/create-blog';
import { setupTestApp } from '../../utils/setup-test-app';

describe('Post API body validation check', () => {
  let app: Express;
  let authToken: string;

  const blogId = 'new blog id';
  const correctTestPostData: TPostCreateInput = getPostDto(blogId);
  const errorsLength = Object.keys(correctTestPostData).length;

  beforeAll(async () => {
    ({ app, authToken } = await setupTestApp());
  });

  afterAll(async () => {
    await stopDB();
  });

  it('POST /api/posts; не должен создавать post с некорректным body', async () => {
    const invalidDataSet1: TPostCreateInput = {
      title: '',
      shortDescription: '',
      content: '',
      blogId: '',
    };
    const invalidDataSetRequest1 = await request(app)
      .post(POSTS_PATH)
      .set('Authorization', authToken)
      .send(invalidDataSet1)
      .expect(EHttpStatus.BAD_REQUEST_400);

    expect(invalidDataSetRequest1.body.errorsMessages).toHaveLength(
      errorsLength,
    );

    const invalidDataSet2: TPostCreateInput = {
      title: '         ',
      shortDescription: '       ',
      content: '       ',
      blogId: '       ',
    };
    const invalidDataSetRequest2 = await request(app)
      .post(POSTS_PATH)
      .set('Authorization', authToken)
      .send(invalidDataSet2)
      .expect(EHttpStatus.BAD_REQUEST_400);

    expect(invalidDataSetRequest2.body.errorsMessages).toHaveLength(
      errorsLength,
    );

    const invalidDataSet3: TPostCreateInput = {
      title: '1'.repeat(POST_TITLE_MAX_FIELD_LENGTH + 1),
      shortDescription: '2'.repeat(POST_SHORT_DESCRIPTION_MAX_FIELD_LENGTH + 1),
      content: '3'.repeat(POST_CONTENT_MAX_FIELD_LENGTH + 1),
      blogId: '       ',
    };
    const invalidDataSetRequest3 = await request(app)
      .post(POSTS_PATH)
      .set('Authorization', authToken)
      .send(invalidDataSet3)
      .expect(EHttpStatus.BAD_REQUEST_400);

    expect(invalidDataSetRequest3.body.errorsMessages).toHaveLength(
      errorsLength,
    );

    const postListResponse = await request(app).get(POSTS_PATH);
    expect(postListResponse.body.items).toHaveLength(0);
  });

  it('PUT /api/posts/:id; не должен изменять post с некорректным body', async () => {
    const createdBlog = await createBlog({ app, authToken });
    const createdPost = await createPost({
      app,
      authToken,
      blogOutput: createdBlog,
    });

    const invalidDataSet1: TPostUpdateInput = {
      title: '',
      shortDescription: '',
      content: '',
      blogId: '',
    };
    const invalidDataSetRequest1 = await request(app)
      .put(`${POSTS_PATH}/${createdPost.id}`)
      .set('Authorization', authToken)
      .send(invalidDataSet1)
      .expect(EHttpStatus.BAD_REQUEST_400);

    expect(invalidDataSetRequest1.body.errorsMessages).toHaveLength(
      errorsLength,
    );

    const invalidDataSet2: TPostUpdateInput = {
      title: '         ',
      shortDescription: '       ',
      content: '       ',
      blogId: '       ',
    };
    const invalidDataSetRequest2 = await request(app)
      .put(`${POSTS_PATH}/${createdPost.id}`)
      .set('Authorization', authToken)
      .send(invalidDataSet2)
      .expect(EHttpStatus.BAD_REQUEST_400);

    expect(invalidDataSetRequest2.body.errorsMessages).toHaveLength(
      errorsLength,
    );

    const invalidDataSet3: TPostUpdateInput = {
      title: '1'.repeat(POST_TITLE_MAX_FIELD_LENGTH + 1),
      shortDescription: '2'.repeat(POST_SHORT_DESCRIPTION_MAX_FIELD_LENGTH + 1),
      content: '3'.repeat(POST_CONTENT_MAX_FIELD_LENGTH + 1),
      blogId: '       ',
    };
    const invalidDataSetRequest3 = await request(app)
      .put(`${POSTS_PATH}/${createdPost.id}`)
      .set('Authorization', authToken)
      .send(invalidDataSet3)
      .expect(EHttpStatus.BAD_REQUEST_400);

    expect(invalidDataSetRequest3.body.errorsMessages).toHaveLength(
      errorsLength,
    );

    const postResponse = await getPostById(app, createdPost.id);

    const expectedPostData: TPostOutput = {
      ...correctTestPostData,
      id: createdPost.id,
      blogId: createdBlog.id,
      blogName: createdBlog.name,
      createdAt: postResponse.createdAt,
    };

    expect(postResponse).toEqual(expectedPostData);
  });
});
