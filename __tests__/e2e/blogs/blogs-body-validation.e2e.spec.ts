import request from 'supertest';
import { Express } from 'express';
import { BLOGS_PATH } from '../../../src/core/constants/paths';
import { EHttpStatus } from '../../../src/core/constants/http';
import {
  BLOG_DESCRIPTION_MAX_FIELD_LENGTH,
  BLOG_NAME_MAX_FIELD_LENGTH,
  BLOG_WEBSITE_URL_MAX_FIELD_LENGTH,
} from '../../../src/blogs/constants/validation';
import { stopDB } from '../../../src/db/mongo.db';
import { TBlogOutput } from '../../../src/blogs/routers/output/blog.output';
import { TBlogCreateInput } from '../../../src/blogs/routers/input/blog-create.input';
import { TBlogUpdateInput } from '../../../src/blogs/routers/input/blog-update.input';
import { getBlogDto } from '../../utils/blogs/get-blog-dto';
import { createBlog } from '../../utils/blogs/create-blog';
import { getBlogById } from '../../utils/blogs/get-blog-by-id';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { setupTestApp } from '../../utils/setup-test-app';

describe('Blog API body validation check', () => {
  let app: Express;
  let authToken: string;

  const correctTestBlogData: TBlogCreateInput = getBlogDto();
  const errorsLength = Object.keys(correctTestBlogData).length;

  beforeAll(async () => {
    ({ app, authToken } = await setupTestApp());
  });

  afterAll(async () => {
    await stopDB();
  });

  it('POST /api/blogs; не должен создавать blog с некорректным body', async () => {
    const invalidDataSet1: TBlogCreateInput = {
      name: '',
      description: '',
      websiteUrl: '',
    };
    const invalidDataSetRequest1 = await request(app)
      .post(BLOGS_PATH)
      .set('Authorization', authToken)
      .send(invalidDataSet1)
      .expect(EHttpStatus.BAD_REQUEST_400);

    expect(invalidDataSetRequest1.body.errorsMessages).toHaveLength(
      errorsLength,
    );

    const invalidDataSet2: TBlogCreateInput = {
      name: '         ',
      description: '       ',
      websiteUrl: 'incorrect-URL.com',
    };
    const invalidDataSetRequest2 = await request(app)
      .post(BLOGS_PATH)
      .set('Authorization', authToken)
      .send(invalidDataSet2)
      .expect(EHttpStatus.BAD_REQUEST_400);

    expect(invalidDataSetRequest2.body.errorsMessages).toHaveLength(
      errorsLength,
    );

    const invalidDataSet3: TBlogCreateInput = {
      name: '1'.repeat(BLOG_NAME_MAX_FIELD_LENGTH + 1),
      description: '2'.repeat(BLOG_DESCRIPTION_MAX_FIELD_LENGTH + 1),
      websiteUrl: `https://${'1'.repeat(BLOG_WEBSITE_URL_MAX_FIELD_LENGTH + 1)}.com`,
    };
    const invalidDataSetRequest3 = await request(app)
      .post(BLOGS_PATH)
      .set('Authorization', authToken)
      .send(invalidDataSet3)
      .expect(EHttpStatus.BAD_REQUEST_400);

    expect(invalidDataSetRequest3.body.errorsMessages).toHaveLength(
      errorsLength,
    );

    const blogListResponse = await request(app).get(BLOGS_PATH);
    expect(blogListResponse.body.items).toHaveLength(0);
  });

  it('PUT /api/blogs/:id; не должен изменять blog с некорректным body', async () => {
    const createdBlog = await createBlog({
      app,
      authToken,
      blogDto: correctTestBlogData,
    });

    const invalidDataSet1: TBlogUpdateInput = {
      name: '',
      description: '',
      websiteUrl: '',
    };
    const invalidDataSetRequest1 = await request(app)
      .put(`${BLOGS_PATH}/${createdBlog.id}`)
      .set('Authorization', generateBasicAuthToken())
      .send(invalidDataSet1)
      .expect(EHttpStatus.BAD_REQUEST_400);

    expect(invalidDataSetRequest1.body.errorsMessages).toHaveLength(
      errorsLength,
    );

    const invalidDataSet2: TBlogUpdateInput = {
      name: '         ',
      description: '       ',
      websiteUrl: 'incorrect-URL.com',
    };
    const invalidDataSetRequest2 = await request(app)
      .put(`${BLOGS_PATH}/${createdBlog.id}`)
      .set('Authorization', authToken)
      .send(invalidDataSet2)
      .expect(EHttpStatus.BAD_REQUEST_400);

    expect(invalidDataSetRequest2.body.errorsMessages).toHaveLength(
      errorsLength,
    );

    const invalidDataSet3: TBlogUpdateInput = {
      name: '1'.repeat(BLOG_NAME_MAX_FIELD_LENGTH + 1),
      description: '2'.repeat(BLOG_DESCRIPTION_MAX_FIELD_LENGTH + 1),
      websiteUrl: `https://${'1'.repeat(BLOG_WEBSITE_URL_MAX_FIELD_LENGTH + 1)}.com`,
    };
    const invalidDataSetRequest3 = await request(app)
      .put(`${BLOGS_PATH}/${createdBlog.id}`)
      .set('Authorization', authToken)
      .send(invalidDataSet3)
      .expect(EHttpStatus.BAD_REQUEST_400);

    expect(invalidDataSetRequest3.body.errorsMessages).toHaveLength(
      errorsLength,
    );

    const blogResponse = await getBlogById(app, createdBlog.id);

    const expectedBlogData: TBlogOutput = {
      ...correctTestBlogData,
      id: createdBlog.id,
      createdAt: blogResponse.createdAt,
      isMembership: blogResponse.isMembership,
    };

    expect(blogResponse).toEqual(expectedBlogData);
  });
});
