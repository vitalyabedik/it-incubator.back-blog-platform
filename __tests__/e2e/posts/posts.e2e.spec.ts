import request from 'supertest';
import express from 'express';
import { setupApp } from './../../../src/setup-app';
import { clearDb } from '../../utils/clear-db';
import { POSTS_PATH } from '../../../src/core/constants/paths';
import { EHttpStatus } from '../../../src/core/constants/http';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { TPostInputDto } from '../../../src/posts/dto/posts.input-dto';
import { getPostDto } from '../../utils/posts/get-post-dto';
import { createPost } from '../../utils/posts/create-post';
import { updatePost } from '../../utils/posts/update-post';
import { getPostById } from '../../utils/posts/get-post-by-id';
import { TPostView } from '../../../src/posts/types';
import { createBlog } from '../../utils/blogs/create-blog';

describe('Post API', () => {
  const app = express();
  setupApp(app);

  const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
    await clearDb(app);
  });

  it('POST /api/posts; должен создавать post', async () => {
    const createdBlog = await createBlog(app);

    const newPost: TPostInputDto = {
      ...getPostDto(createdBlog.id),
      title: 'new post title',
      shortDescription: 'new post shortDescription',
      content: 'new post content',
      blogId: createdBlog.id,
    };

    await createPost(app, createdBlog, newPost);
  });

  it('GET /api/posts; должен возвращать post list', async () => {
    const createdBlog = await createBlog(app);

    await createPost(app, createdBlog);
    await createPost(app, createdBlog);

    const response = await request(app)
      .get(POSTS_PATH)
      .expect(EHttpStatus.OK_200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThanOrEqual(2);
  });

  it('GET /api/posts/:id; должен возвращать post по id', async () => {
    const createdBlog = await createBlog(app);
    const createdPost = await createPost(app, createdBlog);

    const post = await getPostById(app, createdPost.id);

    expect(post).toEqual({
      ...createdPost,
      id: expect.any(String),
    });
  });

  it('PUT /api/posts/:id; должен корректно изменять post по id', async () => {
    const createdBlog = await createBlog(app);
    const createdPost = await createPost(app, createdBlog);

    const postUpdateData: TPostInputDto = {
      title: 'updated title',
      shortDescription: 'updated shortDescription',
      content: 'updated content',
      blogId: createdPost.blogId,
    };

    await updatePost(app, createdPost.id, postUpdateData);

    const postResponse = await getPostById(app, createdPost.id);

    const expectedPostData: TPostView = {
      ...postUpdateData,
      id: createdPost.id,
      blogId: createdPost.blogId,
      blogName: createdBlog.name,
    };

    expect(postResponse).toEqual(expectedPostData);
  });

  it('DELETE /api/posts/:id; должен удалять post по id', async () => {
    const createdBlog = await createBlog(app);
    const createdPost = await createPost(app, createdBlog);

    await request(app)
      .delete(`${POSTS_PATH}/${createdPost.id}`)
      .set('Authorization', adminToken)
      .expect(EHttpStatus.NO_CONTENT_204);

    await request(app)
      .get(`${POSTS_PATH}/${createdPost.id}`)
      .expect(EHttpStatus.NOT_FOUND_404);
  });
});
