import { Request } from 'express';
import requestIp from 'request-ip';

const IP_ERROR_MESSAGE = 'Нет возможности определить IP address';

export const getRequestIp = (req: Request) => {
  return requestIp.getClientIp(req) || IP_ERROR_MESSAGE;
};
