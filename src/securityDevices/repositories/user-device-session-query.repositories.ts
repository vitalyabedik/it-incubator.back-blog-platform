import { injectable } from 'inversify';
import { TDeviceOutput } from './output/device.output';
import { mapToDeviceOutput } from './mappers/map-to-device-output.util';
import { UserDeviceSessionModel } from '../model/user-device-session.model';

@injectable()
export class UserDeviceSessionQueryRepository {
  constructor() {}

  async getUserDeviceSessionListByUserId(
    userId: string,
  ): Promise<TDeviceOutput[]> {
    const devices = await UserDeviceSessionModel.find({ userId }).lean().exec();

    const deviceListOutput = devices.map(mapToDeviceOutput);

    return deviceListOutput;
  }
}
