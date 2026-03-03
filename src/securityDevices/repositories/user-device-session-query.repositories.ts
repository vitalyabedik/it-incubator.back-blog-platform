import { injectable } from 'inversify';
import { securityDevicesCollection } from '../../db/mongo.db';
import { TDeviceOutput } from './output/device.output';
import { mapToDeviceOutput } from './mappers/map-to-device-output.util';

@injectable()
export class UserDeviceSessionQueryRepository {
  constructor() {}

  async getUserDeviceSessionList(): Promise<TDeviceOutput[]> {
    const devices = await securityDevicesCollection.find().toArray();

    const deviceListOutput = devices.map(mapToDeviceOutput);

    return deviceListOutput;
  }

  async getUserDeviceSessionListByUserId(
    userId: string,
  ): Promise<TDeviceOutput[]> {
    const devices = await securityDevicesCollection.find({ userId }).toArray();

    const deviceListOutput = devices.map(mapToDeviceOutput);

    return deviceListOutput;
  }
}
