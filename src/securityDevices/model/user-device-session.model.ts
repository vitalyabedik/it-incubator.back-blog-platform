import { Model, model, Schema } from 'mongoose';
import {
  TUserDeviceSession,
  TUserDeviceSessionDocument,
  TUserDeviceSessionMethods,
  TUserDeviceSessionStaticMethods,
} from '../types/user-device-session.types';
import { TUserDeviceSessionUpdateInput } from '../routers/input/user-device-session-update.input';
import { TUserDeviceSessionCreateInput } from '../routers/input/user-device-session-create.input';
import { mapToDeviceDocument } from '../repositories/mappers/map-to-device-document.util';

type TUserDeviceSessionModel = Model<
  TUserDeviceSession,
  unknown,
  TUserDeviceSessionMethods
> &
  TUserDeviceSessionStaticMethods;

const userDeviceSessionSchema = new Schema<
  TUserDeviceSession,
  TUserDeviceSessionModel,
  TUserDeviceSessionMethods
>(
  {
    userId: {
      type: String,
      required: true,
    },
    deviceId: {
      type: String,
      required: true,
    },
    iat: {
      type: Date,
      required: true,
    },
    deviceName: {
      type: String,
      required: true,
    },
    ip: {
      type: String,
      required: true,
    },
    expirationAt: {
      type: Date,
      required: true,
    },
  },
  { collection: 'device-sessions', versionKey: false },
);

userDeviceSessionSchema.method(
  'checkIsForeignSession',
  function checkIsForeignSession(userId: string) {
    return this.userId !== userId;
  },
);

userDeviceSessionSchema.method(
  'updateUserDeviceSession',
  function updateUserDeviceSession(dto: TUserDeviceSessionUpdateInput) {
    this.ip = dto.ip;
    this.iat = dto.iat;
    this.expirationAt = dto.expirationAt;

    return this;
  },
);

userDeviceSessionSchema.static(
  'createUserDevicesSessionInstance',
  async function createUserDevicesSessionInstance(
    dto: TUserDeviceSessionCreateInput,
  ): ReturnType<
    TUserDeviceSessionStaticMethods['createUserDevicesSessionInstance']
  > {
    const newUserDeviceSession = mapToDeviceDocument(dto);

    const userDeviceSessionDocument = await this.create(newUserDeviceSession);

    return userDeviceSessionDocument as unknown as TUserDeviceSessionDocument;
  },
);

export const UserDeviceSessionModel = model<
  TUserDeviceSession,
  TUserDeviceSessionModel
>('device-session', userDeviceSessionSchema);
