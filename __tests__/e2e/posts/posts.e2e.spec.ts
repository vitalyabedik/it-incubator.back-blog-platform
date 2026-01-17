import request from 'supertest';
import { Express } from 'express';
import { POSTS_PATH } from '../../../src/core/constants/paths';
import { EHttpStatus } from '../../../src/core/constants/http';
import { TPostOutput } from '../../../src/posts/routers/output/post.output';
import { TPostCreateInput } from '../../../src/posts/routers/input/post-create.input';
import { TPostUpdateInput } from '../../../src/posts/routers/input/post-update.input';
import { stopDB } from '../../../src/db/mongo.db';
import { getPostDto } from '../../utils/posts/get-post-dto';
import { createPost } from '../../utils/posts/create-post';
import { updatePost } from '../../utils/posts/update-post';
import { getPostById } from '../../utils/posts/get-post-by-id';
import { createBlog } from '../../utils/blogs/create-blog';
import { setupTestApp } from '../../utils/setup-test-app';

describe('Post API', () => {
  let app: Express;
  let authToken: string;

  beforeAll(async () => {
    ({ app, authToken } = await setupTestApp());
  });

  afterAll(async () => {
    await stopDB();
  });

  it('POST /api/posts; должен создавать post', async () => {
    const createdBlog = await createBlog({ app, authToken });

    const newPost: TPostCreateInput = {
      ...getPostDto(createdBlog.id),
      title: 'new post title',
      shortDescription: 'new post shortDescription',
      content: 'new post content',
      blogId: createdBlog.id,
    };

    await createPost({
      app,
      authToken,
      blogOutput: createdBlog,
      postDto: newPost,
    });
  });

  it('GET /api/posts; должен возвращать post list', async () => {
    const createdBlog = await createBlog({ app, authToken });

    await createPost({ app, authToken, blogOutput: createdBlog });
    await createPost({ app, authToken, blogOutput: createdBlog });

    const response = await request(app)
      .get(POSTS_PATH)
      .expect(EHttpStatus.OK_200);

    expect(response.body.items).toBeInstanceOf(Array);
    expect(response.body.items.length).toBeGreaterThanOrEqual(2);
  });

  it('GET /api/posts/:id; должен возвращать post по id', async () => {
    const createdBlog = await createBlog({ app, authToken });
    const createdPost = await createPost({
      app,
      authToken,
      blogOutput: createdBlog,
    });

    const post = await getPostById(app, createdPost.id);

    expect(post).toEqual({
      ...createdPost,
      id: expect.any(String),
    });
  });

  it('PUT /api/posts/:id; должен корректно изменять post по id', async () => {
    const createdBlog = await createBlog({ app, authToken });
    const createdPost = await createPost({
      app,
      authToken,
      blogOutput: createdBlog,
    });

    const postUpdateData: TPostUpdateInput = {
      title: 'updated title',
      shortDescription: 'updated shortDescription',
      content: 'updated content',
      blogId: createdPost.blogId,
    };

    await updatePost({
      app,
      authToken,
      postId: createdPost.id,
      postDto: postUpdateData,
    });

    const postResponse = await getPostById(app, createdPost.id);

    const expectedPostData: TPostOutput = {
      ...postUpdateData,
      id: createdPost.id,
      blogId: createdPost.blogId,
      blogName: createdBlog.name,
      createdAt: postResponse.createdAt,
    };

    expect(postResponse).toEqual(expectedPostData);
  });

  it('DELETE /api/posts/:id; должен удалять post по id', async () => {
    const createdBlog = await createBlog({ app, authToken });
    const createdPost = await createPost({
      app,
      authToken,
      blogOutput: createdBlog,
    });

    await request(app)
      .delete(`${POSTS_PATH}/${createdPost.id}`)
      .set('Authorization', authToken)
      .expect(EHttpStatus.NO_CONTENT_204);

    await request(app)
      .get(`${POSTS_PATH}/${createdPost.id}`)
      .expect(EHttpStatus.NOT_FOUND_404);
  });
});
