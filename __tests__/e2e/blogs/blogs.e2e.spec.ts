import request from 'supertest';
import { Express } from 'express';
import { BLOGS_PATH } from '../../../src/core/constants/paths';
import { EHttpStatus } from '../../../src/core/constants/http';
import { TBlogCreateInput } from '../../../src/blogs/routers/input/blog-create.input';
import { TBlogUpdateInput } from '../../../src/blogs/routers/input/blog-update.input';
import { TBlogOutput } from '../../../src/blogs/routers/output/blog.output';
import { stopDB } from '../../../src/db/mongo.db';
import { getBlogDto } from '../../utils/blogs/get-blog-dto';
import { createBlog } from '../../utils/blogs/create-blog';
import { getBlogById } from '../../utils/blogs/get-blog-by-id';
import { updateBlog } from '../../utils/blogs/update-blog';
import { setupTestApp } from '../../utils/setup-test-app';

describe('Blog API', () => {
  let app: Express;
  let authToken: string;

  beforeAll(async () => {
    ({ app, authToken } = await setupTestApp());
  });

  afterAll(async () => {
    await stopDB();
  });

  it('POST /api/blogs; должен создавать blog', async () => {
    const newBlog: TBlogCreateInput = {
      ...getBlogDto(),
      name: 'new blog name',
      description: 'new blog description',
    };

    await createBlog({ app, authToken, blogDto: newBlog });
  });

  it('GET /api/blogs; должен возвращать blog list', async () => {
    await createBlog({ app, authToken });
    await createBlog({ app, authToken });

    const response = await request(app)
      .get(BLOGS_PATH)
      .expect(EHttpStatus.OK_200);

    expect(response.body.items).toBeInstanceOf(Array);
    expect(response.body.items.length).toBeGreaterThanOrEqual(2);
  });

  it('GET /api/blogs/:id; должен возвращать blog по id', async () => {
    const createdBlog = await createBlog({ app, authToken });

    const blog = await getBlogById(app, createdBlog.id);

    expect(blog).toEqual({
      ...createdBlog,
      id: expect.any(String),
    });
  });

  it('PUT /api/blogs/:id; должен корректно изменять blog по id', async () => {
    const createdBlog = await createBlog({ app, authToken });

    const blogUpdateData: TBlogUpdateInput = {
      name: 'updated name',
      description: 'updated description',
      websiteUrl: 'https://updated-url.com',
    };

    await updateBlog({
      app,
      authToken,
      blogId: createdBlog.id,
      blogDto: blogUpdateData,
    });

    const blogResponse = await getBlogById(app, createdBlog.id);

    const expectedBlogData: TBlogOutput = {
      ...blogUpdateData,
      id: createdBlog.id,
      createdAt: blogResponse.createdAt,
      isMembership: blogResponse.isMembership,
    };

    expect(blogResponse).toEqual(expectedBlogData);
  });

  it('DELETE /api/blogs/:id; должен удалять blog по id', async () => {
    const createdBlog = await createBlog({ app, authToken });

    await request(app)
      .delete(`${BLOGS_PATH}/${createdBlog.id}`)
      .set('Authorization', authToken)
      .expect(EHttpStatus.NO_CONTENT_204);

    await request(app)
      .get(`${BLOGS_PATH}/${createdBlog.id}`)
      .expect(EHttpStatus.NOT_FOUND_404);
  });
});
