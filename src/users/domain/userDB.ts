type TUserDBEmailConfirmation = {
  isConfirmed: boolean;
  confirmationCode: string;
  expirationDate: string;
};

type TUserDBPasswordRecovery = {
  recoveryCode: string;
  expirationDate: string;
};

export type TUserDB = {
  login: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  emailConfirmation: TUserDBEmailConfirmation;
  passwordRecovery?: TUserDBPasswordRecovery;
};
