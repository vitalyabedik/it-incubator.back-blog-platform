import { sub } from 'date-fns';
import { RequestLogModel } from '../model/request-log.model';
import { TRequestLog } from '../types/request-logs.types';
import { TRequestLogsQueryInput } from '../types/request-logs-query.input';

export const requestLogsRepository = {
  async addRequestLog(log: TRequestLog): Promise<string> {
    const { id } = await RequestLogModel.create(log);

    return id;
  },

  async getRequestByFilterCount(
    filter: TRequestLogsQueryInput,
  ): Promise<number> {
    const count = await RequestLogModel.countDocuments({
      ip: filter.ip,
      url: filter.url,
      date: {
        $gte: sub(new Date(), { seconds: filter.timeWindowDurationSeconds }),
      },
    });

    return count;
  },
};
