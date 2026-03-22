import { JWTService } from '../../auth/adapters/jwt.service';
import { iocContainer } from '../../composition-root';

export const getUserIdFromAccessToken = async (
  tokenString: string | undefined,
) => {
  if (!tokenString) return null;

  const [authType, token] = tokenString.split(' ');
  if (authType !== 'Bearer') return null;

  const jwtService = iocContainer.get(JWTService);

  const result = await jwtService.verifyAccessToken(token);

  return result ? result.userId : null;
};
