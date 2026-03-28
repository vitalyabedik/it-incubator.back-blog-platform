import { model, Schema } from 'mongoose';
import { TRequestLog } from '../types/request-logs.types';

const requestLogSchema = new Schema(
  {
    ip: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  { collection: 'request-logs' },
);

export const RequestLogModel = model<TRequestLog>(
  'request-log',
  requestLogSchema,
);
