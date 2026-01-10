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
import { updateBlog } from '../../utils/blogs/update-blog';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { TBlogView } from '../../../src/blogs/types';

describe('Blog API', () => {
  const app = express();
  setupApp(app);

  const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
    await clearDb(app);
  });

  it('POST /api/blogs; должен создавать blog', async () => {
    const newBlog: TBlogInputDto = {
      ...getBlogDto(),
      name: 'new blog name',
      description: 'new blog description',
    };

    await createBlog(app, newBlog);
  });

  it('GET /api/blogs; должен возвращать blog list', async () => {
    await createBlog(app);
    await createBlog(app);

    const response = await request(app)
      .get(BLOGS_PATH)
      .expect(EHttpStatus.OK_200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThanOrEqual(2);
  });

  it('GET /api/blogs/:id; должен возвращать blog по id', async () => {
    const createdBlog = await createBlog(app);

    const blog = await getBlogById(app, createdBlog.id);

    expect(blog).toEqual({
      ...createdBlog,
      id: expect.any(String),
    });
  });

  it('PUT /api/blogs/:id; должен корректно изменять blog по id', async () => {
    const createdBlog = await createBlog(app);

    const blogUpdateData: TBlogInputDto = {
      name: 'updated name',
      description: 'updated description',
      websiteUrl: 'https://updated-url.com',
    };

    await updateBlog(app, createdBlog.id, blogUpdateData);

    const blogResponse = await getBlogById(app, createdBlog.id);

    const expectedBlogData: TBlogView = {
      ...blogUpdateData,
      id: createdBlog.id,
    };

    expect(blogResponse).toEqual(expectedBlogData);
  });

  it('DELETE /api/blogs/:id; должен удалять blog по id', async () => {
    const createdBlog = await createBlog(app);

    await request(app)
      .delete(`${BLOGS_PATH}/${createdBlog.id}`)
      .set('Authorization', adminToken)
      .expect(EHttpStatus.NO_CONTENT_204);

    await request(app)
      .get(`${BLOGS_PATH}/${createdBlog.id}`)
      .expect(EHttpStatus.NOT_FOUND_404);
  });
});
