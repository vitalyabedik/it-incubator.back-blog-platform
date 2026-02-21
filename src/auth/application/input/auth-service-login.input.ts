import { TAuthLoginInput } from '../../routers/input/auth-login.input';

export type TAuthServiceLoginInput = {
  ip: string;
  deviceName: string;
  loginDto: TAuthLoginInput;
};
