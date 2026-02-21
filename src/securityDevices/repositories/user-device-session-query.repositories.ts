import { securityDevicesCollection } from '../../db/mongo.db';
import { TDeviceOutput } from './output/device.output';
import { mapToDeviceOutput } from './mappers/map-to-device-output.util';

export const userDeviceSessionQueryRepository = {
  async getUserDeviceSessionList(): Promise<TDeviceOutput[]> {
    const devices = await securityDevicesCollection.find().toArray();

    const deviceListOutput = devices.map(mapToDeviceOutput);

    return deviceListOutput;
  },

  async getUserDeviceSessionListByUserId(
    userId: string,
  ): Promise<TDeviceOutput[]> {
    const devices = await securityDevicesCollection.find({ userId }).toArray();

    const deviceListOutput = devices.map(mapToDeviceOutput);

    return deviceListOutput;
  },
};
