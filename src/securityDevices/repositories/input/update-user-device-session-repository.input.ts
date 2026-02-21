import { TDeviceDB } from '../../domain/deviceDB';

export type TUpdateUserDeviceSessionRepository = { prevIat: number } & Omit<
  TDeviceDB,
  'userId' | 'deviceName'
>;
