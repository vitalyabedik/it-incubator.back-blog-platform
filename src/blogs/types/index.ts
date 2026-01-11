export type TBlog = {
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
};

export type TBlogViewModel = TBlog & {
  id: string;
};

export type TGetBlogParams = {
  id: string;
};

export type TUpdateBlogParams = {
  id: string;
};

export type TDeleteBlogParams = {
  id: string;
};
