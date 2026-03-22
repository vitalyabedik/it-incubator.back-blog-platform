import {
  HydratedDocument,
  InferSchemaType,
  model,
  Schema,
  Types,
} from 'mongoose';

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

export type TRequestLog = InferSchemaType<typeof requestLogSchema> & {
  _id: Types.ObjectId;
};
export type TRequestLogDocument = HydratedDocument<TRequestLog>;

export const RequestLogModel = model<TRequestLog>(
  'request-log',
  requestLogSchema,
);
