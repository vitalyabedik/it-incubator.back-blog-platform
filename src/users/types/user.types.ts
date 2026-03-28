import { HydratedDocument, Types } from 'mongoose';
import { TUserCreateInput } from '../routes/input/user-create.input';

type TEmailConfirmation = {
  confirmationCode: string;
  expirationDate?: Date | null;
  isConfirmed: boolean;
};

type TPasswordRecovery = {
  recoveryCode: string;
  expirationDate?: Date | null;
};

export type TUser = {
  login: string;
  email: string;
  createdAt: Date;
  passwordHash: string;
  emailConfirmation: TEmailConfirmation;
  passwordRecovery?: TPasswordRecovery;
};

export type TUserStaticMethods = {
  checkIsUserExist(dto: {
    login: string;
    email: string;
  }): Promise<
    { isExist: true; byField: 'login' | 'email' } | { isExist: false }
  >;
  createUserInstance(dto: TUserCreateInput): Promise<TUserDocument>;
  createUnconfirmedUserInstance(
    dto: TUserCreateInput,
  ): Promise<{ userDocument: TUserDocument; confirmationCode: string }>;
};

export type TUserMethods = {
  checkIsConfirmed(): boolean;
  checkIsConfirmationExpired(): boolean;
  confirmUser(): TUserDocument;
  updateUserConfirmationData(): TUserDocument;
  setPasswordRecoveryData(): TUserDocument;
  checkIsRecoveryPasswordExist(): boolean;
  checkIsRecoveryPasswordExpired(): boolean;
  updateUserPassword(passwordHash: string): TUserDocument;
};

export type TUserMapInput = { _id: Types.ObjectId } & TUser;

export type TUserDocument = HydratedDocument<TUser, TUserMethods>;
