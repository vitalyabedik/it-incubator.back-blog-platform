import { TRequestLog } from './request-logs.types';

export type TRequestLogsQueryInput = {
  timeWindowDurationSeconds: number;
} & Omit<TRequestLog, 'date'>;
