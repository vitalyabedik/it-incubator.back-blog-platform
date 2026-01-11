export type TPost = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
};

export type TPostViewModel = TPost & {
  id: string;
};

export type TGetPostParams = {
  id: string;
};

export type TUpdatePostParams = {
  id: string;
};

export type TDeletePostParams = {
  id: string;
};
