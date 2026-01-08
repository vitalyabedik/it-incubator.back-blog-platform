export type TPostView = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
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
