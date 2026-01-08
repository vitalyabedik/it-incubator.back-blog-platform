import request from 'supertest';
import express from 'express';
import { setupApp } from './../../../src/setup-app';
import { clearDb } from '../../utils/clear-db';
import { createBlog } from '../../utils/blogs/create-blog';
import { POSTS_PATH } from '../../../src/core/constants/paths';
import { EHttpStatus } from '../../../src/core/constants/http';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { TPostInputDto } from '../../../src/posts/dto/posts.input-dto';
import { getPostDto } from '../../utils/posts/get-post-dto';
import { createPost } from '../../utils/posts/create-post';
import { updatePost } from '../../utils/posts/update-post';
import { getPostById } from '../../utils/posts/get-post-by-id';
import { TPostView } from '../../../src/posts/types';

describe('Post API', () => {
  const app = express();
  setupApp(app);

  const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
    await clearDb(app);
  });

  it('POST /api/posts; должен создавать post', async () => {
    const newPost: TPostInputDto = {
      ...getPostDto(),
      title: 'new post title',
      shortDescription: 'new post shortDescription',
      content: 'new post content',
      blogId: 'new-blog-id',
    };

    await createPost(app, newPost);
  });

  it('GET /api/posts; должен возвращать post list', async () => {
    await createPost(app);
    await createPost(app);

    const response = await request(app)
      .get(POSTS_PATH)
      .expect(EHttpStatus.Ok_200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThanOrEqual(2);
  });

  it('GET /api/posts/:id; должен возвращать post по id', async () => {
    const createdPost = await createPost(app);

    const post = await getPostById(app, createdPost.id);

    expect(post).toEqual({
      ...createdPost,
      id: expect.any(String),
    });
  });

  it('PUT /api/posts/:id; должен корректно изменять post по id', async () => {
    const createdBlog = await createBlog(app);
    const createdPost = await createPost(app);

    const postUpdateData: TPostInputDto = {
      title: 'updated title',
      shortDescription: 'updated shortDescription',
      content: 'updated content',
      blogId: createdBlog.id,
    };

    await updatePost(app, createdPost.id, postUpdateData);

    const postResponse = await getPostById(app, createdPost.id);

    const expectedPostData: TPostView = {
      ...postUpdateData,
      id: createdPost.id,
      blogId: createdBlog.id,
      blogName: '',
    };

    expect(postResponse).toEqual(expectedPostData);
  });

  it('DELETE /api/posts/:id; должен удалять post по id', async () => {
    const createdPost = await createPost(app);

    await request(app)
      .delete(`${POSTS_PATH}/${createdPost.id}`)
      .set('Authorization', adminToken)
      .expect(EHttpStatus.NoContent_204);

    await request(app)
      .get(`${POSTS_PATH}/${createdPost.id}`)
      .expect(EHttpStatus.NotFound_404);
  });
});
