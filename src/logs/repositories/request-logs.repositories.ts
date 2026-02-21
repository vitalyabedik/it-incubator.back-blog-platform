import { sub } from 'date-fns';
import { requestLogsCollection } from '../../db/mongo.db';
import { TRequestLogsDB } from '../domain/request-logs-db';

export const requestLogsRepository = {
  async addRequestLog(log: TRequestLogsDB): Promise<string> {
    const { insertedId } = await requestLogsCollection.insertOne(log);

    return insertedId.toString();
  },

  async getRequestByFilterCount(
    filter: { timeWindowDurationSeconds: number } & Omit<
      TRequestLogsDB,
      'date'
    >,
  ): Promise<number> {
    const count = await requestLogsCollection.countDocuments({
      ip: filter.ip,
      url: filter.url,
      date: {
        $gte: sub(new Date(), { seconds: filter.timeWindowDurationSeconds }),
      },
    });

    return count;
  },
};
