import request from 'supertest';
import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { clearDb } from '../../utils/clear-db';
import { POSTS_PATH } from '../../../src/core/constants/paths';
import { EHttpStatus } from '../../../src/core/constants/http';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { TPostInputDto } from '../../../src/posts/dto/posts.input-dto';
import { getPostDto } from '../../utils/posts/get-post-dto';
import { createPost } from '../../utils/posts/create-post';
import { getPostById } from '../../utils/posts/get-post-by-id';
import {
  POST_CONTENT_MAX_FIELD_LENGTH,
  POST_SHORT_DESCRIPTION_MAX_FIELD_LENGTH,
  POST_TITLE_MAX_FIELD_LENGTH,
} from '../../../src/posts/constants/validation';
import { TPostView } from '../../../src/posts/types';
import { createBlog } from '../../utils/blogs/create-blog';

describe('Post API body validation check', () => {
  const app = express();
  setupApp(app);

  const blogId = 'new blog id';
  const correctTestPostData: TPostInputDto = getPostDto(blogId);
  const adminToken = generateBasicAuthToken();
  const errorsLength = Object.keys(correctTestPostData).length;

  beforeAll(async () => {
    await clearDb(app);
  });

  it('POST /api/posts; не должен создавать post с некорректным body', async () => {
    const invalidDataSet1: TPostInputDto = {
      title: '',
      shortDescription: '',
      content: '',
      blogId: '',
    };
    const invalidDataSetRequest1 = await request(app)
      .post(POSTS_PATH)
      .set('Authorization', adminToken)
      .send(invalidDataSet1)
      .expect(EHttpStatus.BAD_REQUEST_400);

    expect(invalidDataSetRequest1.body.errorsMessages).toHaveLength(
      errorsLength,
    );

    const invalidDataSet2: TPostInputDto = {
      title: '         ',
      shortDescription: '       ',
      content: '       ',
      blogId: '       ',
    };
    const invalidDataSetRequest2 = await request(app)
      .post(POSTS_PATH)
      .set('Authorization', adminToken)
      .send(invalidDataSet2)
      .expect(EHttpStatus.BAD_REQUEST_400);

    expect(invalidDataSetRequest2.body.errorsMessages).toHaveLength(
      errorsLength,
    );

    const invalidDataSet3: TPostInputDto = {
      title: '1'.repeat(POST_TITLE_MAX_FIELD_LENGTH + 1),
      shortDescription: '2'.repeat(POST_SHORT_DESCRIPTION_MAX_FIELD_LENGTH + 1),
      content: '3'.repeat(POST_CONTENT_MAX_FIELD_LENGTH + 1),
      blogId: '       ',
    };
    const invalidDataSetRequest3 = await request(app)
      .post(POSTS_PATH)
      .set('Authorization', adminToken)
      .send(invalidDataSet3)
      .expect(EHttpStatus.BAD_REQUEST_400);

    expect(invalidDataSetRequest3.body.errorsMessages).toHaveLength(
      errorsLength,
    );

    const postListResponse = await request(app).get(POSTS_PATH);
    expect(postListResponse.body).toHaveLength(0);
  });

  it('PUT /api/posts/:id; не должен изменять post с некорректным body', async () => {
    const createdBlog = await createBlog(app);
    const createdPost = await createPost(app, createdBlog);

    const invalidDataSet1: TPostInputDto = {
      title: '',
      shortDescription: '',
      content: '',
      blogId: '',
    };
    const invalidDataSetRequest1 = await request(app)
      .put(`${POSTS_PATH}/${createdPost.id}`)
      .set('Authorization', generateBasicAuthToken())
      .send(invalidDataSet1)
      .expect(EHttpStatus.BAD_REQUEST_400);

    expect(invalidDataSetRequest1.body.errorsMessages).toHaveLength(
      errorsLength,
    );

    const invalidDataSet2: TPostInputDto = {
      title: '         ',
      shortDescription: '       ',
      content: '       ',
      blogId: '       ',
    };
    const invalidDataSetRequest2 = await request(app)
      .put(`${POSTS_PATH}/${createdPost.id}`)
      .set('Authorization', adminToken)
      .send(invalidDataSet2)
      .expect(EHttpStatus.BAD_REQUEST_400);

    expect(invalidDataSetRequest2.body.errorsMessages).toHaveLength(
      errorsLength,
    );

    const invalidDataSet3: TPostInputDto = {
      title: '1'.repeat(POST_TITLE_MAX_FIELD_LENGTH + 1),
      shortDescription: '2'.repeat(POST_SHORT_DESCRIPTION_MAX_FIELD_LENGTH + 1),
      content: '3'.repeat(POST_CONTENT_MAX_FIELD_LENGTH + 1),
      blogId: '       ',
    };
    const invalidDataSetRequest3 = await request(app)
      .put(`${POSTS_PATH}/${createdPost.id}`)
      .set('Authorization', adminToken)
      .send(invalidDataSet3)
      .expect(EHttpStatus.BAD_REQUEST_400);

    expect(invalidDataSetRequest3.body.errorsMessages).toHaveLength(
      errorsLength,
    );

    const postResponse = await getPostById(app, createdPost.id);

    const expectedPostData: TPostView = {
      ...correctTestPostData,
      id: createdPost.id,
      blogId: createdBlog.id,
      blogName: createdBlog.name,
    };

    expect(postResponse).toEqual(expectedPostData);
  });
});
