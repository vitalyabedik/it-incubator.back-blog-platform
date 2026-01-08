import { db } from '../../db/in-memory.db';
import { TPostInputDto } from '../dto/posts.input-dto';
import { TPostView } from '../types';

export const postsRepository = {
  findAll(): TPostView[] {
    return db.posts;
  },
  findById(id: string): TPostView | null {
    return db.posts.find((post) => post.id === id) || null;
  },
  create(newPost: TPostView): TPostView {
    db.posts.push(newPost);
    return newPost;
  },
  update(id: string, dto: TPostInputDto): void {
    const post = db.posts.find((post) => post.id === id)!;

    const { blogId, content, shortDescription, title } = dto;

    post.blogId = blogId;
    post.content = content;
    post.shortDescription = shortDescription;
    post.title = title;

    return;
  },
  delete(id: string): void {
    const index = db.posts.findIndex((post) => post.id === id);

    db.posts.splice(index, 1);
    return;
  },
};
