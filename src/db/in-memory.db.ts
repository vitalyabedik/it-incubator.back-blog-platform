import { TBlogView } from '../blogs/types';
import { TPostView } from '../posts/types';

export const db = {
  blogs: <TBlogView[]>[
    {
      id: 'blog-1',
      name: 'IT-INCUBATOR',
      description: 'Samurai Way',
      websiteUrl: 'https://it-incubator.io',
    },
  ],
  posts: <TPostView[]>[
    {
      id: 'post-1',
      blogId: 'blog-1',
      blogName: 'IT-INCUBATOR',
      title: 'Samurai Way Back',
      content: 'Nest',
      shortDescription: 'Back course',
    },
  ],
};
