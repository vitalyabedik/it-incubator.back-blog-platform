export type TUserCreateInput = {
  login: string;
  email: string;
  passwordHash: string;
};

export type TUserCreateRequestInput = {
  login: string;
  password: string;
  email: string;
};
