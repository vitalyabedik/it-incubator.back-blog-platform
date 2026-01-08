import request from 'supertest';
import express from 'express';
import { setupApp } from './../../../src/setup-app';
import { clearDb } from '../../utils/clear-db';
import { TBlogInputDto } from '../../../src/blogs/dto/blogs.input-dto';
import { getBlogDto } from '../../utils/blogs/get-blog-dto';
import { createBlog } from '../../utils/blogs/create-blog';
import { BLOGS_PATH } from '../../../src/core/constants/paths';
import { EHttpStatus } from '../../../src/core/constants/http';
import { getBlogById } from '../../utils/blogs/get-blog-by-id';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import {
  BLOG_DESCRIPTION_MAX_FIELD_LENGTH,
  BLOG_NAME_MAX_FIELD_LENGTH,
  BLOG_WEBSITE_URL_MAX_FIELD_LENGTH,
} from '../../../src/blogs/constants/validation';
import { TBlogView } from '../../../src/blogs/types';

describe('Blog API body validation check', () => {
  const app = express();
  setupApp(app);

  const correctTestBlogData: TBlogInputDto = getBlogDto();
  const adminToken = generateBasicAuthToken();
  const errorsLength = Object.keys(correctTestBlogData).length;

  beforeAll(async () => {
    await clearDb(app);
  });

  it('POST /api/blogs; не должен создавать blog с некорректным body', async () => {
    const invalidDataSet1: TBlogInputDto = {
      name: '',
      description: '',
      websiteUrl: '',
    };
    const invalidDataSetRequest1 = await request(app)
      .post(BLOGS_PATH)
      .set('Authorization', adminToken)
      .send(invalidDataSet1)
      .expect(EHttpStatus.BadRequest_400);

    expect(invalidDataSetRequest1.body.errorMessages).toHaveLength(
      errorsLength,
    );

    const invalidDataSet2: TBlogInputDto = {
      name: '         ',
      description: '       ',
      websiteUrl: 'incorrect-URL.com',
    };
    const invalidDataSetRequest2 = await request(app)
      .post(BLOGS_PATH)
      .set('Authorization', adminToken)
      .send(invalidDataSet2)
      .expect(EHttpStatus.BadRequest_400);

    expect(invalidDataSetRequest2.body.errorMessages).toHaveLength(
      errorsLength,
    );

    const invalidDataSet3: TBlogInputDto = {
      name: '1'.repeat(BLOG_NAME_MAX_FIELD_LENGTH + 1),
      description: '2'.repeat(BLOG_DESCRIPTION_MAX_FIELD_LENGTH + 1),
      websiteUrl: `https://${'1'.repeat(BLOG_WEBSITE_URL_MAX_FIELD_LENGTH + 1)}.com`,
    };
    const invalidDataSetRequest3 = await request(app)
      .post(BLOGS_PATH)
      .set('Authorization', adminToken)
      .send(invalidDataSet3)
      .expect(EHttpStatus.BadRequest_400);

    expect(invalidDataSetRequest3.body.errorMessages).toHaveLength(
      errorsLength,
    );

    const blogListResponse = await request(app).get(BLOGS_PATH);
    expect(blogListResponse.body).toHaveLength(0);
  });

  it('PUT /api/blogs/:id; не должен изменять blog с некорректным body', async () => {
    const createdBlog = await createBlog(app, correctTestBlogData);

    const invalidDataSet1: TBlogInputDto = {
      name: '',
      description: '',
      websiteUrl: '',
    };
    const invalidDataSetRequest1 = await request(app)
      .put(`${BLOGS_PATH}/${createdBlog.id}`)
      .set('Authorization', generateBasicAuthToken())
      .send(invalidDataSet1)
      .expect(EHttpStatus.BadRequest_400);

    expect(invalidDataSetRequest1.body.errorMessages).toHaveLength(
      errorsLength,
    );

    const invalidDataSet2: TBlogInputDto = {
      name: '         ',
      description: '       ',
      websiteUrl: 'incorrect-URL.com',
    };
    const invalidDataSetRequest2 = await request(app)
      .put(`${BLOGS_PATH}/${createdBlog.id}`)
      .set('Authorization', adminToken)
      .send(invalidDataSet2)
      .expect(EHttpStatus.BadRequest_400);

    expect(invalidDataSetRequest2.body.errorMessages).toHaveLength(
      errorsLength,
    );

    const invalidDataSet3: TBlogInputDto = {
      name: '1'.repeat(BLOG_NAME_MAX_FIELD_LENGTH + 1),
      description: '2'.repeat(BLOG_DESCRIPTION_MAX_FIELD_LENGTH + 1),
      websiteUrl: `https://${'1'.repeat(BLOG_WEBSITE_URL_MAX_FIELD_LENGTH + 1)}.com`,
    };
    const invalidDataSetRequest3 = await request(app)
      .put(`${BLOGS_PATH}/${createdBlog.id}`)
      .set('Authorization', adminToken)
      .send(invalidDataSet3)
      .expect(EHttpStatus.BadRequest_400);

    expect(invalidDataSetRequest3.body.errorMessages).toHaveLength(
      errorsLength,
    );

    const blogResponse = await getBlogById(app, createdBlog.id);

    const expectedBlogData: TBlogView = {
      ...correctTestBlogData,
      id: createdBlog.id,
    };

    expect(blogResponse).toEqual(expectedBlogData);
  });
});
