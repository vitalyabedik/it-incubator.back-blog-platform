import { sub } from 'date-fns';
import { RequestLogModel, TRequestLog } from '../model/request-log.model';

export const requestLogsRepository = {
  async addRequestLog(log: Omit<TRequestLog, '_id'>): Promise<string> {
    const { id } = await RequestLogModel.create(log);

    return id;
  },

  async getRequestByFilterCount(
    filter: { timeWindowDurationSeconds: number } & Omit<
      TRequestLog,
      '_id' | 'date'
    >,
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
