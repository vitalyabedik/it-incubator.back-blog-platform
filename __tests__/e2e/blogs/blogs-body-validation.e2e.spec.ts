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

describe('Blog API body validation check', () => {
  const app = express();
  setupApp(app);

  const correctTestBlogData: TBlogInputDto = getBlogDto();

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
      .send(invalidDataSet1)
      .expect(EHttpStatus.BadRequest_400);

    expect(invalidDataSetRequest1.body.errorMessages).toHaveLength(3);

    const invalidDataSet2: TBlogInputDto = {
      name: '         ',
      description: '       ',
      websiteUrl: 'incorrect-URL.com',
    };
    const invalidDataSetRequest2 = await request(app)
      .post(BLOGS_PATH)
      .send(invalidDataSet2)
      .expect(EHttpStatus.BadRequest_400);

    expect(invalidDataSetRequest2.body.errorMessages).toHaveLength(3);

    const invalidDataSet3: TBlogInputDto = {
      name: 'incorrect name length',
      description: '       ',
      websiteUrl: 'https://incorrect-URL',
    };
    const invalidDataSetRequest3 = await request(app)
      .post(BLOGS_PATH)
      .send(invalidDataSet3)
      .expect(EHttpStatus.BadRequest_400);

    expect(invalidDataSetRequest3.body.errorMessages).toHaveLength(3);

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
      .send(invalidDataSet1)
      .expect(EHttpStatus.BadRequest_400);

    expect(invalidDataSetRequest1.body.errorMessages).toHaveLength(3);

    const invalidDataSet2: TBlogInputDto = {
      name: '         ',
      description: '       ',
      websiteUrl: 'incorrect-URL.com',
    };
    const invalidDataSetRequest2 = await request(app)
      .put(`${BLOGS_PATH}/${createdBlog.id}`)
      .send(invalidDataSet2)
      .expect(EHttpStatus.BadRequest_400);

    expect(invalidDataSetRequest2.body.errorMessages).toHaveLength(3);

    const invalidDataSet3: TBlogInputDto = {
      name: 'incorrect name length',
      description: '       ',
      websiteUrl: 'https://incorrect-URL',
    };
    const invalidDataSetRequest3 = await request(app)
      .put(`${BLOGS_PATH}/${createdBlog.id}`)
      .send(invalidDataSet3)
      .expect(EHttpStatus.BadRequest_400);

    expect(invalidDataSetRequest3.body.errorMessages).toHaveLength(3);

    const blogResponse = await getBlogById(app, createdBlog.id);
    expect(blogResponse).toEqual({
      ...correctTestBlogData,
      id: createdBlog.id,
    });
  });
});
